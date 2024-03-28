import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimalName, AnimalSchema, ObservationSchema } from '@/services/schemas'
import { IObservationsValue, haversineDistance, useObservations } from '@/contexts/ObservationContext';
import * as Location from 'expo-location';

export type CurrentAnimal = {
    id: string;
    name: string;
    color: string;
}

export type FilteredObservation = ObservationSchema & {
    id: string;
    color: string;
}

export type FilterCriteria = {
    startDate: Date;
    endDate: Date;
    startTime: number;
    endTime: number;
}

export const sortAnimalNames = (animalName: AnimalName[]) => {
    return animalName.sort((a, b) => b.upvotes - a.upvotes);
}

const getRandomHexColor = (): string => {
    // Generate a random integer between 0 and 0xFFFFFF (16777215 in decimal)
    const randomColor = Math.floor(Math.random() * 16777216);
    // Convert the number to a hexadecimal string and ensure it's 6 characters long
    return '#' + randomColor.toString(16).padStart(6, '0');
  }

//be able to compare times irrespective of their dates,
//return the time in minutes since midnight
const toMinutesSinceMidnight = (date: Date | number) => {
    date = typeof date === "number" ? new Date(date) : date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * 60 + minutes;
}

export type UseSearchBarFilter = {
    currentAnimals: CurrentAnimal[];
    filterCriteria: FilterCriteria;
    observations: IObservationsValue;
    filteredObservations: FilteredObservation[];
    addAnimal: (animal: AnimalSchema) => void;
    deleteAnimal: (id: string) => void;
    changeDateTimeFilter: ({ startDate, endDate, startTime, endTime }: FilterCriteria) => void;
    changeAnimalColor: ({ color, id }: {color: string; id: string;}) => void;
}

const useSearchAndFilter = () => {
    
    const observations = useObservations();

    const [currentAnimals, setCurrentAnimals] = useState<CurrentAnimal[]>([]);
    const [focusedObservation, setFocusedObservation] = useState<ObservationSchema | null>(null);
    const [activeAutofilter, setActiveAutofilter] = useState(false);
    //TODO - maybe initialise the start date to the earliest observation date
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date().setHours(0, 0, 0, 0), //set initial time to 12:00 AM,
        endTime: new Date().setHours(23, 59, 0, 0) //set initial time to 11:59 PM
    });

    //get the closest observation to the user's location
    type ClosestObservation = ObservationSchema & {id: string} | null;
    const getClosestObservation = (
        {userLocation, animalName}: 
        {userLocation: Location.LocationObject, animalName: string}
    ): ClosestObservation => {
        let closestObservation: ClosestObservation = null;
        let minDistance = Infinity;
        console.log("closest-observation: ", observations.data[0].animalName)
        observations.data.forEach(observation => {
            if (observation.animalName.some(a => a.name === animalName)) {
                const distance = haversineDistance(
                    userLocation.coords.latitude, userLocation.coords.longitude,
                    observation.location.latitude, observation.location.longitude 
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestObservation = observation;
                }
            }
        });
        return closestObservation;
    }

    //auto adjusts the filterCriteria to show all the currentAnimals added by the user
    const autoFilterCriteria = useCallback(() => {
        // Filter observations to include only those with animal names present in currentAnimals
        const relevantObservations = observations.data.filter(observation =>
            observation.animalName.some(animalName =>
                currentAnimals.some(currentAnimal => currentAnimal.id === animalName.refId)
            )
        );
        console.log("autofilter", {currentAnimals})
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
    }, [currentAnimals, observations.data, filterCriteria])
    
    const changeDateTimeFilter = ({startDate, endDate, startTime, endTime}: FilterCriteria) => {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        setFilterCriteria({startDate, endDate, startTime, endTime})
    }

    const changeAnimalColor: UseSearchBarFilter["changeAnimalColor"] = ({color, id}) => {
        setCurrentAnimals((prev) => prev.map(animal => {
            if (animal.id === id) {
                return {...animal, color};
            }
            return animal;
        }))
    }

    useEffect(() => {
        if (activeAutofilter) {
            autoFilterCriteria();
            setActiveAutofilter(false);
        }
    }, [currentAnimals])

    const addAnimal = useCallback((animal: AnimalSchema) => {
        //must be unique
        if (currentAnimals.some(a => a.id === animal.id)) return;
        console.log("added animal")
        const newAnimal = {...animal, color: getRandomHexColor()} as CurrentAnimal; 
        // generate random color
        setCurrentAnimals((prev) => [...prev, newAnimal]);
        console.log("add-animal", {currentAnimals})
        console.log("add-animal", {newAnimal})
        autoFilterCriteria()
    }, [currentAnimals, autoFilterCriteria])

    //remove animal with id from currentAnimals
    const deleteAnimal = (id: string) => {
        setCurrentAnimals((prev) => prev.filter(animal => animal.id !== id));
    }

    const getCurrentAnimal = (observation: ObservationSchema & {id: string}): CurrentAnimal | null => {
        let currentAnimal = null;
        currentAnimals.forEach(animal => {
            if (observation.animalName.some(a => a.refId === animal.id)) {
                currentAnimal = animal;
            };
        })
        return currentAnimal;
    }

    const filteredObservations = useMemo(()=> {
        console.log("filtering observations...")
       const filtered: FilteredObservation[] = []
        observations.data.forEach((observation, index) => {
            //sort by upvotes first
            observation.animalName = sortAnimalNames(observation.animalName);
            //name criteria
            const currentAnimal = getCurrentAnimal(observation);
            if (!currentAnimal) return;
            //filter criteria
            const observationDate = new Date(observation.timestamp);
            const keepTime = new Date(observation.timestamp)
            observationDate.setHours(0, 0, 0, 0); //evaluate the dates at the same time
            //date criteria
            if (observationDate < filterCriteria.startDate) return;
            if (observationDate > filterCriteria.endDate) return;
            //time criteria
            const startMinutes = toMinutesSinceMidnight(filterCriteria.startTime);
            const endMinutes = toMinutesSinceMidnight(filterCriteria.endTime);
            const dbTimeMinutes = toMinutesSinceMidnight(keepTime);
            
            if (dbTimeMinutes < startMinutes || dbTimeMinutes > endMinutes) return;
            console.log(observation.animalName[0].name,{observationDate})
            //add once all criteria is met
            filtered.push({...observation, color: currentAnimal.color });
        })
        return filtered;
    }, [observations.data, currentAnimals, filterCriteria])

    useEffect(() => {}, [])
    
    return {
        currentAnimals,
        filterCriteria,
        observations,
        filteredObservations,
        addAnimal,
        deleteAnimal,
        changeDateTimeFilter,
        changeAnimalColor,
        autoFilterCriteria,
        getClosestObservation,
        setActiveAutofilter
    }
}

export default useSearchAndFilter