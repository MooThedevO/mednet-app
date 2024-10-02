import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { addRequest } from '../services/api';
import { styles } from '../styles/AddRequestScreenStyle';

const AddRequestScreen = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const handleAddRequest = async () => {
    if (!medicationName || !quantity) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const requestData = { medication: { name: medicationName }, quantity };

    try {
      await addRequest(requestData);
      Alert.alert('Success', 'Request added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Request</Text>
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
      <Button title="Submit" onPress={handleAddRequest} />
    </View>
  );
};

export default AddRequestScreen;
