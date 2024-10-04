import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';
import styles from '../styles/FulfillRequestScreenStyles';

const FulfillRequestScreen = () => {
  const { requestId } = useRoute().params;
  const navigation = useNavigation();

  // Confirmation handler
  const handleFulfillRequest = async () => {
    try {
      await api.fulfillRequest(requestId);
      Alert.alert('Success', 'Request has been fulfilled successfully!');
      navigation.navigate('Home'); // Navigate to home after success
    } catch (error) {
      console.error('Failed to fulfill request:', error);
      Alert.alert('Error', 'Failed to fulfill the request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Are you sure you want to fulfill this request?</Text>
      <Button title="Confirm Fulfillment" onPress={handleFulfillRequest} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default FulfillRequestScreen;
