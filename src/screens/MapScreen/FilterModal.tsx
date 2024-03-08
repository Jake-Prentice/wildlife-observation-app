import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';

const FilterModal = (    
    {isVisible, onClose}: 
    {isVisible: boolean; onClose: () => void}
) => {
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
          <Text>Filter</Text>
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
  },    
  
  exitButton: {
    backgroundColor: "#3d8afe",
    padding: 5,
    borderRadius: 50,
    position: "absolute", 
    top:-20,
    right:0
  },
})
export default FilterModal