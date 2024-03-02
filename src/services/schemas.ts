
export type UserStatSchema = {
    uid: string;
    numObservations: number;
    contributions: number;
}

export type UseRef = {
    refId: string;
    name: string;
}

export type AnimalName = {
    refId: string;
    name: string;
    upvotes: number
}

export type ObservationSchema = {
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
    images: string[]
    description: string;
}
  
export type AnimalSchema = {
    id: string;
    name: string;
    hasScienceInfo: boolean;
} 
  