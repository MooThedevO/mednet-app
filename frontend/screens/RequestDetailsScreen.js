import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRequest, deleteRequest } from '../services/api';
import { UserContext } from '../context/UserContext';
import styles from '../styles/RequestDetailsScreenStyles.js';

const RequestDetailsScreen = () => {
  const { requestId } = useRoute().params;
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await getRequest(requestId);
      setRequest(response);
    } catch (error) {
      console.error(error);
    }
  };
  if (!request) return <Text>Loading...</Text>;

  const isCreator = request.userId === user.id;
  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  const confirmDelete = () => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteRequest, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRequest(requestId);
      navigation.goBack(); // Navigate back after deleting
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>User: {request.User.fullName}</Text>
      <Text style={styles.detailText}>Medication: {request.Medication.name}</Text>
      <Text style={styles.detailText}>Quantity: {request.quantity}</Text>
      <Text style={styles.detailText}>Urgency: {request.UrgencyLevel.level}</Text>
      <Text style={styles.detailText}>Condition: {request.MedicalCondition.name}</Text>
      <Text style={styles.detailText}>Doctor Prescription: {request.doctorPrescription ? 'Yes' : 'No'}</Text>
      <Text style={styles.detailText}>Donation Request: {request.isDonation ? 'Yes' : 'No'}</Text>
      <Text style={styles.detailText}>Pickup Location: {request.pickupLocation || 'Not Set'}</Text>
      <Text style={styles.detailText}>Pickup Date: {request.pickupDate ? new Date(request.pickupDate).toLocaleDateString() : 'Not Set'}</Text>

      {isCreator || isAdmin ? (
        <>
          <Button title="Update Request" onPress={() => navigation.navigate('UpdateRequest', { requestId })} />
          <Button title="Delete Request" onPress={confirmDelete} />
        </>
      ) : (
        <Button title="Fulfill Request" onPress={() => navigation.navigate('FulfillRequest', { requestId })} />
      )}
    </View>
  );
};

export default RequestDetailsScreen;