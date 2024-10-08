import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchMedications } from '../services/api'; 
import styles from '../styles/MedicationListScreenStyles';

const MedicationListScreen = () => {
  const [medications, setMedications] = useState([]);
  const navigation = useNavigation();

  const getAllMedications = async () => {
    try {
      const response = await fetchMedications();
      setMedications(response);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllMedications();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <Text style={styles.medicationText}>Medication: {item.name}</Text>
      <Text style={styles.medicationText}>Form: {item.MedicationForm.name}</Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('MedicationDetails', { medicationId: item.id })}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add New Medication" onPress={() => navigation.navigate('AddMedication')} />
    </View>
  );
};

export default MedicationListScreen;
