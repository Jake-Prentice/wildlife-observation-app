import React, { createContext, useContext, useEffect, useState } from 'react';
import {} from "firebase/app"
import { UseCamera } from '@/hooks/useCamera';
import * as services from '@/services/observations';
import { DocumentData, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from 'src/FirebaseConfig'; 
import { AnimalName, AnimalSchema, ObservationSchema } from '@/services/schemas';
import { useUser } from './UserContext';

//distance between longitude and latitude of two points (in km)
export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => { 
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

//returns the average location of the images, and a radius around that average location,
//that encapsulates all the points
const getLocationInfo = (images: UseCamera[]) => {
    const location = {radius: -1} as {latitude: number, longitude: number, radius: number};
    const centroid = images.reduce((acc, image) => {
        acc.latitude += image?.current?.exif?.GPSLatitude;
        acc.longitude += image?.current?.exif?.GPSLongitude;
        return acc;
    }, { latitude: 0, longitude: 0 });
    
    location.latitude = centroid.latitude / images.length;
    location.longitude = centroid.longitude / images.length;

    //if there is more than one location, need to calculate radius
    if (images.length > 1) {
        const radius = images.reduce((maxDistance, image) => {
            const distance = haversineDistance(
                location.latitude, location.longitude,
                image?.current?.exif?.GPSLatitude, image?.current?.exif?.GPSLongitude
            );
            return Math.max(maxDistance, distance);
        }, 0);
        location.radius = radius
    }
    return location;
}

//returns the most recent timestamp of the images
const getMostRecentTimestamp = (images: UseCamera[]): Date => {
    return images
      .map(image => new Date(image.current?.exif?.timestamp))
      .reduce((mostRecent, current) => current < mostRecent ? current : mostRecent);
}

export type ImageToUpload = {
    uri: string;
    metadata: { [key: string]: any }; 
}

export type ObservationToUpload = {
    user: {
        refId: string;
        name: string;
    }
    animalName: AnimalName[];
    location: {
        latitude: number;
        longitude: number;
        radius: number;
    }
    timestamp: string;
    description: string;
    images: ImageToUpload[]
}


export interface IObservationsValue {
    //the id gets added in the onSnapshot
    data: (ObservationSchema & {id: string})[];
    animals: AnimalSchema[]; 
    add: (observation: {animalName: string, description: string, images: UseCamera[]}) => Promise<ObservationSchema>;
    isUploading: boolean;
    focused: ObservationSchema | null;
    setFocused: React.Dispatch<React.SetStateAction<ObservationSchema | null>>;

}

const ObservationContext = createContext<Partial<IObservationsValue>>({});

export const ObservationProvider = ({ children }: { children: React.ReactNode }) => {
    //states
    const [observations, setObservations] = useState<(ObservationSchema & {id: string})[]>([]);

    const [focused, setFocused] = useState<ObservationSchema | null>(null);

    const [animals, setAnimals] = useState<AnimalSchema[]>([]);
    //flags
    const [isUploading, setIsUploading] = useState(false);

    const user = useUser();

    //add a new observation to db
    const add = async (
        {animalName, description, images}: 
        {animalName: string, description: string, images: UseCamera[]}
    ) => {
        setIsUploading(true);
        
        const formatUser = {
            refId: user.info?.uid,
            name: user?.info?.displayName
        }

        const animalId = await services.processAnimalName(animalName);

        const formatAnimalName = {
            refId: animalId, 
            name: animalName, 
            upvotes: 0
        } as AnimalName;

        const observation = {
            user: formatUser,
            animalName: [formatAnimalName], 
            description
        } as ObservationToUpload;
        
        //the images the user didn't leave blank 
        const filteredImages = images.filter(image => image.result !== undefined);
        //get the data in the right format to upload...
        observation.images = filteredImages.map(image => ({
            uri: image.current!.uri,
            metadata: {
                latitude: JSON.stringify(image.current?.exif?.GPSLatitude),
                longitude: JSON.stringify(image.current?.exif?.GPSLongitude),
            }
        }));
        observation.timestamp = getMostRecentTimestamp(filteredImages).toISOString();
        observation.location = getLocationInfo(filteredImages);
        //upload to firebase
        let res = null;
        try{ 
            res = await services.addObservation(observation);
            setIsUploading(false);
        }catch(err){
           throw err;
        }
        return res;
    }

    //look for changes in observations db and update it's state
    useEffect(() => {
        const collectionRef = collection(db, 'observations');
        const q = query(collectionRef);
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const updatedObservations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as DocumentData) as ObservationSchema,
          }));
          setObservations(updatedObservations);
        });

        return () => unsubscribe();
    }, []);

    //look for changes in animals db and update it's state
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'animals')), (snapshot) => {
            const loadedAnimals = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as {name: string, hasScienceInfo: boolean} ),
            }));
            setAnimals(loadedAnimals);
        });
        return () => unsubscribe(); 
    }, []);

    const value = {
        data: observations,
        isUploading,
        add,
        animals,
        focused,
        setFocused
    };

    return (
        <ObservationContext.Provider value={value}>
            {children}
        </ObservationContext.Provider>
    )
};

export const useObservations = () => {
    return useContext(ObservationContext) as IObservationsValue;
}
