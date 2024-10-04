import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { addRequest } from '../services/api';
import styles from '../styles/AddRequestScreenStyles';

const AddRequestScreen = () => {
  const [medicationId, setMedicationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgencyId, setUrgencyId] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [doctorPrescription, setDoctorPrescription] = useState(false);
  const [isDonation, setIsDonation] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      await addRequest({
        medicationId,
        quantity,
        urgencyId,
        conditionId,
        doctorPrescription,
        isDonation,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Medication:</Text>
      <TextInput style={styles.input} value={medicationId} onChangeText={setMedicationId} placeholder="Enter Medication" />
      <Text>Quantity:</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Enter Quantity" />
      <Text>Urgency Level:</Text>
      <Picker selectedValue={urgencyId} onValueChange={setUrgencyId}>
        {/* Add urgency level options */}
      </Picker>
      <Text>Condition:</Text>
      <Picker selectedValue={conditionId} onValueChange={setConditionId}>
        {/* Add medical condition options */}
      </Picker>
      <View style={styles.checkboxContainer}>
        <Text>Doctor Prescription:</Text>
        <Switch value={doctorPrescription} onValueChange={setDoctorPrescription} />
      </View>
      <View style={styles.checkboxContainer}>
        <Text>Donation Request:</Text>
        <Switch value={isDonation} onValueChange={setIsDonation} />
      </View>
      <Button title="Add Request" onPress={handleSubmit} />
    </View>
  );
};

export default AddRequestScreen;
