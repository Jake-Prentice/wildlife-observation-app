import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Animal, getAnimalScienceData } from '@/services/animals';


interface AnimalItemProps {
    data: Animal;
}

interface AnimalItemProps {
    data: Animal;
}
    
const AnimalItem: React.FC<AnimalItemProps> = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.itemTitle}>{data.name}</Text>
        {expanded && (
          <View style={styles.detailsContainer}>
            <Text>Type: {data.characteristics.type}</Text>
            <Text>Diet: {data.characteristics.diet}</Text>
            <Text>Lifespan: {data.characteristics.lifespan}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  

const AnimalScienceList = (animalName: string | undefined) => {

    const [data, setData] = useState<Animal[]>([]);

    useEffect(() => {
        if (!animalName) return;
        (async () => {
            const data = await getAnimalScienceData("lion")
            setData(data)
        })();
      }, [animalName])

      useEffect(() => {
        console.log({data})
      }, [data])

    return (
        <View style={styles.listContainer}>
            {data.map((animal) => (
                <AnimalItem key={animal.name} data={animal} />
            ))}    
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: '#d2d2d246',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 5,
    },
  });

  
export default AnimalScienceList