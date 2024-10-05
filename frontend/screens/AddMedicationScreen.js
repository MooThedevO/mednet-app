import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { addMedication, fetchMedForms } from '../services/api'; 
import styles from '../styles/AddMedicationScreenStyles';

const AddMedicationScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [dosage, setDosage] = useState('');
  const [formId, setFormId] = useState(null); // For MedicationForm
  const [storage, setStorage] = useState('');
  const [medicationForms, setMedicationForms] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const forms = await fetchMedForms();
      setMedicationForms(forms);
    } catch (error) {
      console.error('Error fetching medication forms:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !activeIngredient || !formId) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const newMedication = {
      name,
      description,
      activeIngredient,
      price: price ? parseFloat(price) : null,
      brand,
      dosage,
      formId,
      storage,
    };

    try {
      await addMedication(newMedication);
      Alert.alert('Success', 'Medication added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add medication');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter medication name"
      />

      <Text style={styles.label}>Active Ingredient *</Text>
      <TextInput
        style={styles.input}
        value={activeIngredient}
        onChangeText={setActiveIngredient}
        placeholder="Enter active ingredient"
      />

      <Text style={styles.label}>Medication Form *</Text>
      <Picker
        selectedValue={formId}
        onValueChange={(itemValue) => setFormId(itemValue)}
        style={styles.picker}
      >
        {medicationForms.map((form) => (
          <Picker.Item key={form.id} label={form.name} value={form.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price (optional)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Brand</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Enter brand (optional)"
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
        placeholder="Enter dosage (optional)"
      />

      <Text style={styles.label}>Storage</Text>
      <TextInput
        style={styles.input}
        value={storage}
        onChangeText={setStorage}
        placeholder="Enter storage instructions (optional)"
      />

      <Button title="Add Medication" onPress={handleSubmit} />
    </View>
  );
};

export default AddMedicationScreen;
