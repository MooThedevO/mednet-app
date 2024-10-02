import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { addDonation } from '../services/api';
import { styles } from '../styles/AddDonationScreenStyle';

const AddDonationScreen = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const handleAddDonation = async () => {
    if (!medicationName || !quantity) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const donationData = { medication: { name: medicationName }, quantity };

    try {
      await addDonation(donationData);
      Alert.alert('Success', 'Donation added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Donation</Text>
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
      <Button title="Submit" onPress={handleAddDonation} />
    </View>
  );
};

export default AddDonationScreen;
