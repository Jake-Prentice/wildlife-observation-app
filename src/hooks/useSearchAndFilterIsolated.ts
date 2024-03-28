
import { ObservationSchema } from '@/services/schemas';
import { IObservationsValue, haversineDistance, useObservations } from '../contexts/ObservationContext';
import * as Location from 'expo-location';

export const toMinutesSinceMidnight = (date: Date | number) => {
    date = typeof date === "number" ? new Date(date) : date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * 60 + minutes;
}
export type CurrentAnimal = {
    id: string;
    name: string;
    color: string;
}
const currentAnimals =  <CurrentAnimal[]>([]);
const observations = {location:{latitude:20,longitude:20},data:[{animalName:[{refId:"id",name:"animal"}],location:{longitude:5,latitude:5},timestamp:[12,34]}]};
type ClosestObservation = ObservationSchema & {id: string} | null;
export const autoFilterCriteria = (current:CurrentAnimal[],observations:IObservationsValue) => {
    // Filter observations to include only those with animal names present in currentAnimals
    console.log(observations);
    const relevantObservations = observations.data.filter(observation =>
        observation.animalName.some(animalName =>
            current.some(currentAnimal => currentAnimal.id === animalName.refId)
        )
    );
    if (relevantObservations.length === 0) return;
    // Extract timestamps and sort them to find the earliest and latest
    const timestamps = relevantObservations.map(observation => new Date(observation.timestamp).getTime()).sort((a, b) => a - b);
    // Update filterCriteria with the earliest and latest observation dates
    changeDateTimeFilter({
        startDate: new Date(timestamps[0]), 
        endDate: new Date(timestamps[timestamps.length - 1]), 
        startTime: new Date().setHours(0,0,0,0), 
        endTime: new Date().setHours(23,59,0,0)}
    );
}
export const getClosestObservation = (
    {userLocation, animalName}: 
    {userLocation: Location.LocationObject, animalName: string}
): ClosestObservation => {
    let closestObservation: ClosestObservation = null;
    let minDistance = Infinity;

    observations.data.forEach(observation => {
        if (observation.animalName.some(a => a.name === animalName)) {
            const distance = haversineDistance(
                userLocation.coords.latitude, userLocation.coords.longitude,
                observation.location.latitude, observation.location.longitude 
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestObservation = observation as unknown as ClosestObservation;
            }
        }
    });
    return closestObservation;
}
export const changeDateTimeFilter = (a:any) => {return "";};