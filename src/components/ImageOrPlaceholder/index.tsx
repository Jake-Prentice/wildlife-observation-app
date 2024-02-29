import React, { useEffect, useState } from 'react';
import ImageModal from '@/components/ImageModal';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import useCamera, { UseCamera } from '@/hooks/useCamera';
import styles from './style';

//either displays the image or the placeholder,
//also allows the user to change the photo but holding down on the image
const ImageOrPlaceholder = ({image, style}: {image: UseCamera, style:any}) => {
    //TODO - don't know why the no comes before the yes, weird but fix this
    const triggerChangeModal = () => {
        Alert.alert(
            'Change Photo',
            'are you sure you want to change the photo?',
            [
                { text: 'Yes', onPress: image.reset},
                { text: 'No', style: 'cancel' },
            ],
        );
    }

    if (image.current != undefined) return (
        <ImageModal 
            onLongPress={triggerChangeModal} 
            style={style} 
            source={image.current.uri} 
        />
    )

    return (
      <TouchableOpacity onPress={image.handleCameraRequest} style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>+</Text>
      </TouchableOpacity>
    );
}

export default ImageOrPlaceholder;