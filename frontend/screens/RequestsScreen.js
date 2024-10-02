import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAllRequests, deleteRequest } from '../services/api';
import styles from '../styles/requestStyles';

const RequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDeleteRequest = (requestId) => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => confirmDeleteRequest(requestId) },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteRequest = async (requestId) => {
    try {
      await deleteRequest(requestId);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request', error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{item.medication.name}</Text>
      <Text style={styles.requestText}>Quantity: {item.quantity}</Text>
      <TouchableOpacity onPress={() => handleDeleteRequest(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateRequest', { requestId: item.id })}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Request" onPress={() => navigation.navigate('AddRequest')} />
    </View>
  );
};

export default RequestsScreen;
