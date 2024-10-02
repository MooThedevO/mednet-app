import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { getRequest, updateRequest } from '../services/api';
import styles from '../styles/UpdateRequestScreenStyles';

const UpdateRequestScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getRequest(requestId);
        setName(data.name);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleSubmit = async () => {
    try {
      await updateRequest(requestId, { name, description });
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
      <Button title="Update" onPress={handleSubmit} />
    </View>
  );
};

export default UpdateRequestScreen;
