import {collection, addDoc, getDocs, doc, getDoc, setDoc, where, query, updateDoc, arrayUnion} from "firebase/firestore";
import {db, storage} from "src/FirebaseConfig";
import {ref, uploadBytesResumable, getDownloadURL, uploadBytes, UploadMetadata} from "firebase/storage";
import { ImageToUpload, ObservationToUpload } from "@/contexts/ObservationContext";
import { ObservationSchema } from "./schemas";

const getImageBlob = async (image: string): Promise<Blob> => {
  try {
    const response = await fetch(image);
    if (!response.ok) {
      throw new Error(`Network response was not ok for URL: ${image}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error fetching image blob:', error);
    throw error; 
  }
};

const uploadImage = async (image: ImageToUpload): Promise<string> => {
  try {
    const blob = await getImageBlob(image.uri);
    const storageRef = ref(storage, `/images/${Date.now()}`);

    const metadata = {
      contentType: "image/jpeg",
      customMetadata: { ...image.metadata },
    };

    // Start a resumable upload
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Wait for the upload to complete
    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Monitor upload progress, handle pause/resume, etc.
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Error during upload:', error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error preparing image for upload:', error);
    throw error; 
  }
};

const uploadImages = async (images: ImageToUpload[]): Promise<string[]> => {
  try {
    const imagePromises = images.map(uploadImage);
    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error; 
  }
};

export const getObservations = async () => {
  const snapshot = await getDocs(collection(db, "observations"));
  return snapshot.docs.map((doc: any) => doc.data());
};

export const addObservation = async (observation: ObservationToUpload): Promise<ObservationSchema> => {
    try {
      const imageURLs = await uploadImages(observation.images);
      console.log("adding observation...")
      const res = {...observation, images: imageURLs} as ObservationSchema;
      await addDoc(collection(db, "observations"), res);
      return res;
    } catch (error) {
      console.error('Error adding observation:', error);
      throw error; 
    }
};

//simply adds animal to 'animals' collection
export const addAnimal = async (name: string) => {
    const animalRef = doc(collection(db, 'animals'));
    await setDoc(animalRef, {
      name: name,
      hasScienceInfo: false 
    });
    console.log(`Animal ${name} added with ID ${animalRef.id}`);
    return animalRef.id; // Return the newly created animal document ID
};

//returns the animal id if it exists
export const getAnimal = async (name: string) => {
    const animalsRef = collection(db, 'animals');
    const q = query(animalsRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const animalDoc = querySnapshot.docs[0];
      return animalDoc.id; // Return the animal document ID
    }

    return null; // Animal not found
};

//with side effects: if animal doesn't exist in animals collection, add it. 
//returns the animal id
export const processAnimalName = async (name: string) => {
    let animalId = await getAnimal(name);

    if (!animalId) {
      // Animal doesn't exist, so add it
      animalId = await addAnimal(name);
    }

    return animalId; // Return the existing or new animal document ID
};

//adds an animal name to an observation
export const addAnimalName = async (observationId: string, name: string) => {
    // Ensure the animal exists in the 'animals' collection, and get its ID
    const animalId = await processAnimalName(name);

    const observationRef = doc(db, 'observations', observationId);
    const animalName = {
        refId: animalId,
        name: name,
        upvotes: 0 
    };

    // Add the AnimalName to the observation's 'animalName' array
    await updateDoc(observationRef, {
      animalName: arrayUnion(animalName)
    });

    console.log(`AnimalName ${name} added to observation ${observationId}`);
};