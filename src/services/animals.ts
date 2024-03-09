
export interface Taxonomy {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    scientific_name: string;
}

export interface Characteristics {
    distinctive_feature?: string;
    temperament?: string;
    training?: string;
    diet: string;
    average_litter_size?: string;
    type: string;
    common_name?: string;
    slogan?: string;
    group?: string;
    color: string;
    skin_type: string;
    lifespan: string;
}

export interface Animal {
    name: string;
    taxonomy: Taxonomy;
    locations: string[];
    characteristics: Characteristics;
}

export const getAnimalScienceData = async (animalName: string) => {
    const url = `https://api.api-ninjas.com/v1/animals?name=${animalName}`;
    const apiKey = 'z54DnmVfjpJ8jwZe+VC8Gg==HiSoum1k4MeGNzDc'; // Replace with your actual API key
    try {
      const response = await fetch(url, {headers: {'X-Api-Key': apiKey}});
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
};