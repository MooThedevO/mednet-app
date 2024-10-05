import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMedicationById, updateMedication } from '../services/api';
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
  const navigation = useNavigation();

  useEffect(() => {
    fetchMedicationDetails();
  }, []);

  const fetchMedicationDetails = async () => {
    try {
      const response = await getMedicationById(medicationId);
      setName(response.name);
      setDescription(response.description);
      setActiveIngredient(response.activeIngredient);
      setPrice(response.price?.toString() || '');
      setBrand(response.brand || '');
      setDosage(response.dosage || '');
      setFormId(response.Form.id?.toString() || '');
      setStorage(response.storage || '');
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
        price,
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
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter Name" />
      <Text>Description:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter Description" />
      <Text>Active Ingredient:</Text>
      <TextInput style={styles.input} value={activeIngredient} onChangeText={setActiveIngredient} placeholder="Enter Active Ingredient" />
      <Text>Price:</Text>
      <TextInput style={styles.input} value={price} keyboardType="numeric" onChangeText={setPrice} placeholder="Enter Price" />
      <Text>Brand:</Text>
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Enter Brand" />
      <Text>Dosage:</Text>
      <TextInput style={styles.input} value={dosage} onChangeText={setDosage} placeholder="Enter Dosage" />
      <Text>Form:</Text>
      <Picker selectedValue={formId} onValueChange={setFormId}>
        {/* Add medication form options */}
      </Picker>
      <Text>Storage:</Text>
      <TextInput style={styles.input} value={storage} onChangeText={setStorage} placeholder="Enter Storage" />
      <Button title="Update Medication" onPress={handleSubmit} />
    </View>
  );
};

export default UpdateMedicationScreen;
