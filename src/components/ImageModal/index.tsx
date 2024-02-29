import React, { useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Make sure to install expo vector icons
import { Image } from 'expo-image';

interface ImageModalProps {
  source: string; 
  style: any;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined
}

const ImageModal: React.FC<ImageModalProps> = ({ source, style, onLongPress}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles(style).container}>
      <TouchableOpacity onLongPress={onLongPress} onPress={() => setModalVisible(true)}>
        <Image source={source} style={styles(style).image} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(style).modalView}>
          <TouchableOpacity
            style={styles(style).closeButton}
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="closecircle" size={30} color="white" />
          </TouchableOpacity>
          <Image source={source} style={styles(style).modalImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = (style: any) => StyleSheet.create({
  container: {
    //default
    width: 100,
    height: 100,
    ...style
  },
  image: {
    //should just fit 100% into container,
    //the image dimensions is controlled by the container
    height: "100%",
    width: "100%",
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '80%', 
    height: '80%', 
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1, // Make sure the button is above other elements
  },
});

export default ImageModal;
