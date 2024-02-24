import {collection, addDoc, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from "src/FirebaseConfig";

export const getObservations = async () => {
  const snapshot = await getDocs(collection(db, "observations"));
  return snapshot.docs.map((doc: any) => doc.data());
};

export const addObservation = async (observation: any) => {
  await addDoc(collection(db, "observations"), observation);
};


/*
There are several ways to write data to Cloud Firestore:

*Set the data of a document within a collection, explicitly specifying a document identifier.
*Add a new document to a collection. In this case, Cloud Firestore automatically generates the document identifier.
*Create an empty document with an automatically generated identifier, and assign data to it later.

*/

export const testAdd = async () => {
    try{ 
        const docRef = await addDoc(collection(db, "users"), {
            first: "Allda",
            last: "Lovelace",
            born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
    }catch(e){
        console.error("Error adding document: ", e);
    }
} 


export const testGet = async () => {
    try{ 
        // const ref = doc(db, "users", "7yvS1Faxx9qSzTUYcqJq");
        const ref = doc(db, "users", "7yvS1Faxx9qSzTUYcqJq");
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        }
        else{
            console.log("No such document!");
        }
        // const snapshot = await getDocs(collection(db, "users"));
        // snapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });

    }catch(e){
        console.error("Error getting documents: ", e);
    }
}