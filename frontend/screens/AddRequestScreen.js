import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { addRequest } from '../services/api';
import styles from '../styles/AddRequestScreenStyles';

const AddRequestScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      await addRequest({ name, description });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Request Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Description</Text>
      <TextInput value={description} onChangeText={setDescription} style={styles.input} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default AddRequestScreen;
