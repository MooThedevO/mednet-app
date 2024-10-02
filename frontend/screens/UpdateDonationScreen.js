import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { updateDonation } from '../services/api';
import { styles } from '../styles/UpdateDonationScreenStyle';

const UpdateDonationScreen = ({ route, navigation }) => {
  const { donation } = route.params; // Get the donation data passed from the previous screen
  const [medicationName, setMedicationName] = useState(donation.medication.name);
  const [quantity, setQuantity] = useState(donation.quantity.toString());

  const handleUpdateDonation = async () => {
    if (!medicationName || !quantity) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const updatedDonationData = { medication: { name: medicationName }, quantity };

    try {
      await updateDonation(donation.id, updatedDonationData);
      Alert.alert('Success', 'Donation updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Donation</Text>
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
      <Button title="Update" onPress={handleUpdateDonation} />
    </View>
  );
};

export default UpdateDonationScreen;
