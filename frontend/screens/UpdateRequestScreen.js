import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { updateRequest } from '../services/api';
import { styles } from '../styles/UpdateRequestScreenStyle';

const UpdateRequestScreen = ({ route, navigation }) => {
  const { request } = route.params; // Get the request data passed from the previous screen
  const [medicationName, setMedicationName] = useState(request.medication.name);
  const [quantity, setQuantity] = useState(request.quantity.toString());

  const handleUpdateRequest = async () => {
    if (!medicationName || !quantity) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const updatedRequestData = { medication: { name: medicationName }, quantity };

    try {
      await updateRequest(request.id, updatedRequestData);
      Alert.alert('Success', 'Request updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />
      <Button title="Update" onPress={handleUpdateRequest} />
    </View>
  );
};

export default UpdateRequestScreen;
