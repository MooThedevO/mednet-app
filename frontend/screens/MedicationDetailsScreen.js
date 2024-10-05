import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMedicationById, deleteMedication } from '../services/api';
import { UserContext } from '../context/UserContext';
import styles from '../styles/MedicationDetailsScreenStyles.js';

const MedicationDetailsScreen = () => {
  const { medicationId } = useRoute().params;
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [medication, setMedication] = useState(null);

  useEffect(() => {
    fetchMedicationDetails();
  }, []);

  const fetchMedicationDetails = async () => {
    try {
      const response = await getMedicationById(medicationId);
      setMedication(response);
    } catch (error) {
      console.error(error);
    }
  };
  
  if (!medication) return <Text>Loading...</Text>;

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  const confirmDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteMedication, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteMedication = async () => {
    try {
      await deleteMedication(medicationId);
      navigation.goBack(); // Navigate back after deleting
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Name: {medication.name}</Text>
      <Text style={styles.detailText}>Description: {medication.description}</Text>
      <Text style={styles.detailText}>Active Ingredient: {medication.activeIngredient}</Text>
      <Text style={styles.detailText}>Price: ${medication.price?.toFixed(2) || 'N/A'}</Text>
      <Text style={styles.detailText}>Brand: {medication.brand || 'N/A'}</Text>
      <Text style={styles.detailText}>Dosage: {medication.dosage || 'N/A'}</Text>
      <Text style={styles.detailText}>Form: {medication.MedicationForm?.name || 'N/A'}</Text>
      <Text style={styles.detailText}>Storage: {medication.storage || 'N/A'}</Text>

      {isAdmin && (
        <>
          <Button title="Update Medication" onPress={() => navigation.navigate('UpdateMedication', { medicationId })} />
          <Button title="Delete Medication" onPress={confirmDelete} />
        </>
      )}
    </View>
  );
};

export default MedicationDetailsScreen;
