import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMedicationById, updateMedication, fetchMedForms } from '../services/api';
import styles from '../styles/UpdateMedicationScreenStyles';

const UpdateMedicationScreen = () => {
  const { medicationId } = useRoute().params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [dosage, setDosage] = useState('');
  const [formId, setFormId] = useState('');
  const [storage, setStorage] = useState('');

  const [forms, setForms] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchMedicationDetails();
    fetchForms(); 
  }, []);

  const fetchMedicationDetails = async () => {
    try {
      const response = await getMedicationById(medicationId);
      setName(response.name);
      setDescription(response.description);
      setActiveIngredient(response.activeIngredient);
      setPrice(response.price ? response.price.toString() : '');
      setBrand(response.brand);
      setDosage(response.dosage);
      setFormId(response.formId);
      setStorage(response.storage);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchForms = async () => {
    try {
      const formsData = await fetchMedForms();
      setForms(formsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateMedication(medicationId, {
        name,
        description,
        activeIngredient,
        price: price ? parseFloat(price) : null, 
        brand,
        dosage,
        formId,
        storage,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter Medication Name" />

      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter Medication Description"
      />

      <Text>Active Ingredient:</Text>
      <TextInput
        style={styles.input}
        value={activeIngredient}
        onChangeText={setActiveIngredient}
        placeholder="Enter Active Ingredient"
      />

      <Text>Price (optional):</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter Price"
        keyboardType="numeric"
      />

      <Text>Brand (optional):</Text>
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Enter Brand" />

      <Text>Dosage (optional):</Text>
      <TextInput style={styles.input} value={dosage} onChangeText={setDosage} placeholder="Enter Dosage" />

      <Text>Form:</Text>
      <Picker selectedValue={formId} onValueChange={setFormId}>
        {forms.map((form) => (
          <Picker.Item key={form.id} label={form.name} value={form.id} />
        ))}
      </Picker>

      <Text>Storage (optional):</Text>
      <TextInput style={styles.input} value={storage} onChangeText={setStorage} placeholder="Enter Storage Info" />

      <Button title="Update Medication" onPress={handleSubmit} />
    </View>
  );
};

export default UpdateMedicationScreen;
