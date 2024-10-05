import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Switch, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';  
import { addRequest, fetchMedications, fetchUrgencyLevels, fetchConditions } from '../services/api';
import styles from '../styles/AddRequestScreenStyles';

const AddRequestScreen = () => {
  const [medicationId, setMedicationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgencyId, setUrgencyId] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [doctorPrescription, setDoctorPrescription] = useState(false);
  const [isDonation, setIsDonation] = useState(false);
  const [statusId] = useState(1); // Default status for new requests
  const [medications, setMedications] = useState([]);
  const [urgencyLevels, setUrgencyLevels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);  // Retrieve user data from UserContext

  // Fetch data for pickers when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const meds = await fetchMedications();
        const urgencies = await fetchUrgencyLevels();
        const conditionsData = await fetchConditions();
        setMedications(meds);
        setUrgencyLevels(urgencies);
        setConditions(conditionsData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load data');
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    try {
      await addRequest({
        userId: user.id,
        medicationId,
        quantity,
        urgencyId,
        conditionId,
        doctorPrescription,
        isDonation,
        statusId
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add request');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Medication:</Text>
      <Picker
        selectedValue={medicationId}
        onValueChange={(itemValue) => setMedicationId(itemValue)}
        style={styles.input}
      >
        {medications.map((medication) => (
          <Picker.Item key={medication.id} label={medication.name} value={medication.id} />
        ))}
      </Picker>

      <Text>Quantity:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter Quantity"
        keyboardType="numeric"
      />

      <Text>Urgency Level:</Text>
      <Picker
        selectedValue={urgencyId}
        onValueChange={(itemValue) => setUrgencyId(itemValue)}
        style={styles.input}
      >
        {urgencyLevels.map((level) => (
          <Picker.Item key={level.id} label={level.level} value={level.id} />
        ))}
      </Picker>

      <Text>Condition:</Text>
      <Picker
        selectedValue={conditionId}
        onValueChange={(itemValue) => setConditionId(itemValue)}
        style={styles.input}
      >
        {conditions.map((condition) => (
          <Picker.Item key={condition.id} label={condition.name} value={condition.id} />
        ))}
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