import React, { createContext, useContext, useEffect, useState } from 'react';
import {} from "firebase/app"
import { UseCamera } from '@/hooks/useCamera';
import * as services from '@/services/observations';

//distance between longitude and latitude of two points (in km)
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => { 
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

    console.log(images[0]?.current?.exif?.GPSLatitude, images[0]?.current?.exif?.GPSLongitude)
    
    location.latitude = centroid.latitude / images.length;
    location.longitude = centroid.longitude / images.length;

    //if there is more than one location, need to calculate radius
    if (images.length > 1) {
        const radius = images.reduce((maxDistance, image) => {
            const distance = haversineDistance(
                centroid.latitude, centroid.longitude,
                image?.current?.exif?.GPSLatitude, image?.current?.exif?.GPSLongitude
            );
            return Math.max(maxDistance, distance);
        }, 0);
        //adjust threshold as needed
        if (radius > 0.1) location.radius = radius;
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
    animalName: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
        radius: number;
    }
    timestamp: string;
    images: ImageToUpload[]
}

//will handle the optimistic update
export const addObservation = async (
    {animalName, description, images}: 
    {animalName: string, description: string, images: UseCamera[]}
) => {
    const observation: ObservationToUpload = {animalName, description} as ObservationToUpload
    //the images the user didn't leave blank 
    const filteredImages = images.filter(image => image.result !== undefined);

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
    await services.addObservation(observation);
}

export interface IObservationsValue {

}

const ObservationContext = createContext<Partial<IObservationsValue>>({});

export const ObservationProvider = ({ children }: { children: React.ReactNode }) => {
    const [observations, setObservations] = useState<services.ObservationSchema[]>([]);

    useEffect(() => {

    }, []);


    const value = {

    };

    return <ObservationContext.Provider value={value}>{children}</ObservationContext.Provider>;
};

export const useObservations = () => {
    return useContext(ObservationContext) as IObservationsValue;
}
