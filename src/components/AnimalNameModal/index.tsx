import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView, Button, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from "./style";
import { AnimalName } from '@/services/schemas';
import * as services from "src/services/observations"
const voteCaretSize = 20

type Props = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  animalNames: AnimalName[] | undefined;
  observationId: string;
}

type FormatName = AnimalName & {
  isLoading: boolean;
}

const AnimalNameModal = ({
    isVisible, 
    setIsVisible, 
    animalNames,
    observationId
}: Props) => {
  
  const [hasAddAnimal, setHasAddAnimal] = useState(false);

  const [newAnimalName, setNewAnimalName] = useState('');
  
  const [formatNames, setFormatNames] = useState<FormatName[]>([])

  useEffect(() => {
    if (!animalNames) return;
    //reformat the animal names 
    setFormatNames(animalNames.map((animal) => {
      return {
        ...animal,
        isLoading: false
      }
    }));
  }, [])

  //sort em by upvotes
  useEffect(() => {
    setFormatNames((prev) => {
      return prev.sort((a, b) => b.upvotes - a.upvotes);
    });
  }, [formatNames])

  //add a new animal name suggestion to an observation
  const addAnimalName = async () => {
      //check if unique first before passing to services
      const name = newAnimalName.replace(/\s+/g, '').toLowerCase();
      if (formatNames.some(animal => animal.name === name)) return;
      setFormatNames((prev) => {return [...prev, {
          refId: 'tempId',
          name,
          upvotes: 0,
          isLoading: true
      }]});
      try{
        await services.addAnimalName(observationId, name);
      }catch(err) {
        throw err;
      }
      setHasAddAnimal(false);
  }

  const handleUpvote = async (refId: string) => {
      setFormatNames(prevNames =>
        prevNames.map(animal => {
          if (animal.refId === refId) {
            return { ...animal, upvotes: animal.upvotes + 1, isLoading: true};
          }
          return animal;
        }),
      );
    
      try {
        await services.upvoteAnimalName(observationId, refId);
        setFormatNames(prevNames =>
          prevNames.map(animal => {
            if (animal.refId === refId) {
              return { ...animal, isLoading: false };
            }
            return animal;
          }),
        );
      } catch (error) {
        console.error(error);
        setFormatNames(prevNames =>
          prevNames.map(animal => {
            if (animal.refId === refId) {
              return { ...animal, upvotes: animal.upvotes - 1, isLoading: false };
            }
            return animal;
          }),
        );
      }
  };

  const handleDownvote = async (refId: string) => {
      setFormatNames(prevNames =>
        prevNames.map(animal => {
          if (animal.refId === refId && animal.upvotes > 0) {
            return { ...animal, upvotes: animal.upvotes - 1, isLoading: true };
          }
          return animal;
        }),
      );

      try {
        await services.downvoteAnimalName(observationId, refId);
        setFormatNames(prevNames =>
          prevNames.map(animal => {
            if (animal.refId === refId) {
              return { ...animal, isLoading: false };
            }
            return animal;
          }),
        );
      } catch (error) {
        console.error(error);
        setFormatNames(prevNames =>
          prevNames.map(animal => {
            if (animal.refId === refId) {
              return { ...animal, upvotes: animal.upvotes + 1, isLoading: false };
            }
            return animal;
          }),
        );
      }
  };

  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.exitButton}>
              <AntDesign name="closecircle" size={30} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
              {formatNames.map((animal, index) => (
                <View key={index} style={styles.animalItem}>
                  <View style={styles.animalNameButton}>
                    <Text style={styles.animalNameText}>{animal.name}</Text>
                  </View>
                  <View style={styles.upvoteContainer}>
                    <TouchableOpacity style={styles.upvoteItem} onPress={() => handleUpvote(animal.refId)} >
                      <AntDesign name="caretup" size={voteCaretSize} color="grey" />
                    </TouchableOpacity>
                    <View style={styles.upvoteItem}>
                      <Text>{animal.upvotes}</Text>
                    </View>
                    <TouchableOpacity style={styles.caretUp} onPress={() => handleDownvote(animal.refId)}>
                      <AntDesign name="caretdown" size={voteCaretSize} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            {hasAddAnimal && (
              <TextInput 
                value={newAnimalName}
                onChangeText={setNewAnimalName}
                style={styles.input}
                placeholder='enter animal name'
              />
            )}
            </ScrollView>
            {!hasAddAnimal ? (
              <Button title="Add Animal Name" onPress={() => setHasAddAnimal(true)} />
            ): (
              <View>
                <Button title="Submit" onPress={addAnimalName}/>
                <Button title="Cancel" onPress={() => setHasAddAnimal(false)} />
              </View>
            )}
          </View>
        </View> 
      </Modal>
  );
};


export default AnimalNameModal;
