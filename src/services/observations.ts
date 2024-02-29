import {collection, addDoc, getDocs, doc, getDoc} from "firebase/firestore";
import {db, storage} from "src/FirebaseConfig";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

type Observation = {
    animalName: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    }
    timestamp: string;
    images: string[]
}


export const getObservations = async () => {
  const snapshot = await getDocs(collection(db, "observations"));
  return snapshot.docs.map((doc: any) => doc.data());
};

export const addObservation = async (observation: Observation) => {
//     const imagePromises = Array.from(images, (image) => uploadImage(image));

//   const imageRes = await Promise.all(imagePromises);
  
    await addDoc(collection(db, "observations"), observation);

};

//upload image to firebase cloud storage
export const manageFileUpload = async (
    fileBlob: any,
    { onStart, onProgress, onComplete, onFail }: {onStart: any, onProgress: any, onComplete: any, onFail: any}
  ) => {
    const imgName = "img-" + new Date().getTime();
    const storageRef = ref(storage, `images/${imgName}.jpg`);
  
    console.log("uploading file", imgName);
  
    // Create file metadata including the content type
    const metadata = {
      contentType: "image/jpeg",
      customMetadata: {
        "uploadedBy": "Allda"
      }
    };
  
    // Trigger file upload start event
    onStart && onStart();
    const uploadTask = uploadBytesResumable(storageRef, fileBlob, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Monitor uploading progress
        onProgress && onProgress(Math.fround(progress).toFixed(2));
      },
      (error: any) => {
        // Something went wrong - dispatch onFail event with error  response
        onFail && onFail(error);
      },
      () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onComplete && onComplete(downloadURL);
                console.log('File available at', downloadURL);
            });
      }
    );
};
  

/*
There are several ways to write data to Cloud Firestore:

*Set the data of a document within a collection, explicitly specifying a document identifier.
*Add a new document to a collection. In this case, Cloud Firestore automatically generates the document identifier.
*Create an empty document with an automatically generated identifier, and assign data to it later.

*/

// export const testAdd = async () => {
//     try{ 
//         const docRef = await addDoc(collection(db, "users"), {
//             first: "Allda",
//             last: "Lovelace",
//             born: 1815
//         });
//         console.log("Document written with ID: ", docRef.id);
//     }catch(e){
//         console.error("Error adding document: ", e);
//     }
// } 


// export const testGet = async () => {
//     try{ 
//         // const ref = doc(db, "users", "7yvS1Faxx9qSzTUYcqJq");
//         const ref = doc(db, "users", "7yvS1Faxx9qSzTUYcqJq");
//         const docSnap = await getDoc(ref);

//         if (docSnap.exists()) {
//             console.log("Document data:", docSnap.data());
//         }
//         else{
//             console.log("No such document!");
//         }
//         // const snapshot = await getDocs(collection(db, "users"));
//         // snapshot.forEach((doc) => {
//         //     console.log(doc.id, " => ", doc.data());
//         // });

//     }catch(e){
//         console.error("Error getting documents: ", e);
//     }
// }