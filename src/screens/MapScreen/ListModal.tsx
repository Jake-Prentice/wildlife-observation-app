import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { AnimalName, ObservationSchema } from '@/services/schemas';
import { CurrentAnimal } from '@/hooks/useSearchAndFilter';
import { Ionicons } from '@expo/vector-icons';
const ListModal = (
    {isVisible, onClose, onDeleteAnimal, currentAnimals}: 
    {isVisible: boolean; onClose: () => void; onDeleteAnimal: (id: string) => void; currentAnimals: CurrentAnimal[]}
) => {

  useEffect(() => {
    console.log(currentAnimals)
  }, [currentAnimals])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.exitButton}>
              <AntDesign name="closecircle" size={30} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.scrollContainer}>
              {currentAnimals.map((animal, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.itemTextContainer}>
                    <Text>{animal.name}</Text>
                  </View>
                  <TouchableOpacity style={styles.changeColorButton} onPress={() => onDeleteAnimal(animal.id)}>
                    <Ionicons name="color-palette-sharp" size={24} color={animal.color} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteAnimal(animal.id)}>
                      <AntDesign name="delete" size={20} color="blue" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: "80%", 
    height: "60%",
    padding: 10,
    borderRadius: 10
  },    
  
  exitButton: {
    backgroundColor: "#3d8afe",
    padding: 5,
    borderRadius: 50,
    position: "absolute", 
    top:-20,
    right:0
  },

  listItem: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10
  },

  itemTextContainer: {
    flex:1,
    marginLeft: 20,
    // borderColor: "blue",
    // borderWidth: 1,
  },

  scrollContainer: {
    flex: 1,
    width: "100%",
    // borderColor: "red",
    // borderWidth: 1,
    padding: 20,
  },

  deleteButton: {
    // borderColor: "blue",
    // borderWidth: 1,
    height: "100%",
    padding: 10
  },

  changeColorButton: {
    // borderColor: "blue",
    // borderWidth: 1,
    height: "100%",
    padding: 10,
    // backgroundColor: "red"
  }

})

export default ListModal