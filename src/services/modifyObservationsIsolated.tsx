import { ObservationToUpload } from "@/contexts/ObservationContext";
import {collection, addDoc, getDocs} from "firebase/firestore";
import {db} from "src/FirebaseConfig";
import { uploadImages } from "./observations";
import { ObservationSchema } from "./schemas";
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