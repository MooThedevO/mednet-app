import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRequest, updateRequest, fetchMedications, fetchUrgencyLevels, fetchConditions } from '../services/api'; 
import styles from '../styles/UpdateRequestScreenStyles';

const UpdateRequestScreen = () => {
  const { requestId } = useRoute().params;
  const [medicationId, setMedicationId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgencyId, setUrgencyId] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [doctorPrescription, setDoctorPrescription] = useState(false);
  const [isDonation, setIsDonation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const [medications, setMedications] = useState([]);
  const [urgencyLevels, setUrgencyLevels] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchRequestDetails();
    fetchDropdownData(); 
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await getRequest(requestId);
      setMedicationId(response.Medication.id);
      setQuantity(response.quantity);
      setUrgencyId(response.UrgencyLevel.id);
      setConditionId(response.MedicalCondition.id);
      setDoctorPrescription(response.doctorPrescription);
      setIsDonation(response.isDonation);
      setPickupLocation(response.pickupLocation);
      setPickupDate(response.pickupDate);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const medicationsData = await fetchMedications();
      setMedications(medicationsData);

      const urgencyData = await fetchUrgencyLevels();
      setUrgencyLevels(urgencyData);

      const conditionsData = await fetchConditions();
      setMedicalConditions(conditionsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateRequest(requestId, {
        medicationId,
        quantity,
        urgencyId,
        conditionId,
        doctorPrescription,
        isDonation,
        pickupLocation,
        pickupDate,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Medication:</Text>
      <Picker selectedValue={medicationId} onValueChange={setMedicationId}>
        {medications.map((med) => (
          <Picker.Item key={med.id} label={med.name} value={med.id} />
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
      <Picker selectedValue={urgencyId} onValueChange={setUrgencyId}>
        {urgencyLevels.map((level) => (
          <Picker.Item key={level.id} label={level.level} value={level.id} />
        ))}
      </Picker>

      <Text>Condition:</Text>
      <Picker selectedValue={conditionId} onValueChange={setConditionId}>
        {medicalConditions.map((condition) => (
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

      <Text>Pickup Location:</Text>
      <TextInput
        style={styles.input}
        value={pickupLocation}
        onChangeText={setPickupLocation}
        placeholder="Enter Pickup Location"
      />

      <Text>Pickup Date:</Text>
      <TextInput
        style={styles.input}
        value={pickupDate}
        onChangeText={setPickupDate}
        placeholder="Enter Pickup Date (YYYY-MM-DD)"
      />

      <Button title="Update Request" onPress={handleSubmit} />
    </View>
  );
};

export default UpdateRequestScreen;
