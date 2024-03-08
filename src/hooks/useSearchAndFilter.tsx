import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { AnimalName, AnimalSchema, ObservationSchema } from '@/services/schemas'
import { useObservations } from '@/contexts/ObservationContext';

    //filter states
    // const [filteredObservations, setFilteredObservations] = useState<(ObservationSchema &{id: string})[]>([]);

    // const currentAnimals = useMemo(() => {
    //     const animalNames: AnimalName[] = [];
    //     filteredObservations.forEach(observation => {
    //         observation.animalName.forEach(animal => {
    //             if (!animalNames.some(name => name.refId === animal.refId)) animalNames.push(animal);
    //         })
    //     });
    //     return animalNames
    // }, [filteredObservations])

    // //add animal to filtered observations
    // const addAnimal = (id: string) => {
    //     const newObservations = observations.data.filter(observation => observation.animalName.some(animal => animal.refId === id));
    //     setFilteredObservations([...filteredObservations, ...newObservations]);        
    // }

    // //delete animal from filtered observations
    // const deleteAnimal = (id: string) => {
    //     const newObservations = filteredObservations.filter(observation => observation.animalName.some(animal => animal.refId !== id));
    //     setFilteredObservations(newObservations);
    // }
export type CurrentAnimal = {
    id: string;
    name: string;
    color: string;
}

export type FilteredObservation = ObservationSchema & {
    id: string;
    color: string;
}

export const sortAnimalNames = (animalName: AnimalName[]) => {
    return animalName.sort((a, b) => b.upvotes - a.upvotes);
}

const useSearchAndFilter = () => {
    
    const observations = useObservations();

    const [currentAnimals, setCurrentAnimals] = useState<CurrentAnimal[]>([]);
    const [filterCriteria, setFilterCriteria] = useState<string>('');

    const addAnimal = (animal: AnimalSchema) => {
        //must be unique
        if (currentAnimals.some(a => a.id === animal.id)) return;
        const newAnimal = {...animal, color: "red"} as CurrentAnimal; 
        // generate random color
        setCurrentAnimals((prev) => [...prev, newAnimal]);
    }

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
       const filtered: FilteredObservation[] = []
        observations.data.forEach(observation => {
            //sort by upvotes first
            observation.animalName = sortAnimalNames(observation.animalName);
            //name criteria
            const currentAnimal = getCurrentAnimal(observation);
            if (!currentAnimal) return;
            //filter criteria

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
        deleteAnimal
    }
}

export default useSearchAndFilter