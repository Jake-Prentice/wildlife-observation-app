import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { AnimalName, ObservationSchema } from '@/services/schemas';
import { CurrentAnimal, UseSearchBarFilter } from '@/hooks/useSearchAndFilter';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, returnedResults } from 'reanimated-color-picker';

type Props = {
    isVisible: boolean; 
    onClose: () => void; 
    onDeleteAnimal: (id: string) => void;
    currentAnimals: CurrentAnimal[];
    changeAnimalColor: UseSearchBarFilter["changeAnimalColor"];
    focusOnClosestObservationTo: (animalName: string) => void;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListModal = (
    {isVisible, onClose, onDeleteAnimal, currentAnimals, changeAnimalColor, focusOnClosestObservationTo, setIsVisible}: Props
) => {

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<CurrentAnimal | null>(null);
  const [currentColor, setCurrentColor] = useState<returnedResults>();

  const onColorPalettePress = (animal: CurrentAnimal) => {
    setCurrentAnimal(animal);
    setShowColorPicker(true);
  }

  const apply = () => {
    if (!currentColor) return;
    changeAnimalColor({
      color: currentColor.hex, 
      id: currentAnimal?.id!
    });
    setShowColorPicker(false);
  }

  const onItemPress = (animalName: string) => {
      Alert.alert(
          'Find animal',
          'would you like me to find the closest ' + animalName + '?',
          [
              { text: 'Yes', onPress: () => {
                focusOnClosestObservationTo(animalName)
                setIsVisible(false);
              }}, 
              { text: 'No', style: 'cancel' },
          ], 
          { cancelable: true }
      );
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
      <View style={styles.modalContainer}>
        <Modal 
          transparent={true} 
          visible={showColorPicker} 
          animationType='fade'
          onRequestClose={() => setShowColorPicker(false)}
        >
            <View style={styles.colorPickerModal} >
              <View style={styles.colorPickerModalBox}>
                <TouchableOpacity onPress={() => setShowColorPicker(false)} style={styles.exitButton}>
                  <AntDesign name="closecircle" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.colorPickerContainer}>
                    <ColorPicker style={{ width: '80%', gap:40 }} value={currentAnimal?.color || "red"} onComplete={color => setCurrentColor(color)}>
                        <Panel1 />
                        <HueSlider />
                        <OpacitySlider />
                    </ColorPicker>
                </View>
                <TouchableOpacity onPress={apply} style={styles.applyButtn}>
                    <Text style={{color: "white"}}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.container}>
              <TouchableOpacity onPress={onClose} style={styles.exitButton}>
                <AntDesign name="closecircle" size={30} color="white" />
              </TouchableOpacity>
              <ScrollView style={styles.scrollContainer}>
                {currentAnimals.length > 0 ? currentAnimals.map((animal, index) => (

                  <View key={index} style={styles.listItem}>
                    <TouchableOpacity onPress={() => onItemPress(animal.name)} style={styles.itemTextContainer}>
                      <Text>{animal.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.changeColorButton} onPress={() => onColorPalettePress(animal)}>
                      <Ionicons name="color-palette-sharp" size={24} color={animal.color} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteAnimal(animal.id)}>
                        <AntDesign name="delete" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>

                )): (
                  <View style={{flex: 1,justifyContent: "center", alignItems: "center"}}>

                    <Text>No animals selected</Text>
                  </View>
                )}
              </ScrollView>
          </View>
        </View>
      </Modal>

    </>
  )
}

const styles = StyleSheet.create({

  applyButtn: {
    backgroundColor: "#3d8afe",
    padding: 10,
    borderRadius: 6,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",    
    // marginTop: 10
  },

  colorPickerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center", 
    // borderColor: "red",
    // borderWidth: 1,
    flex:1,
    backgroundColor: "#cdcdcda6",
    borderRadius:10
  },

  colorPickerModalBox: {
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: "80%", 
    height: "60%",
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    gap: 10
  },

  colorPickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

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
    right:-10,
    zIndex: 10
  },

  listItem: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    borderColor: "#3d3d3d28",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff"
    //add a shadow
    
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
    backgroundColor: "#eaeaea",
    borderRadius: 10

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