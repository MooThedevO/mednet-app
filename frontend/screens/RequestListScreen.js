import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllRequests } from '../services/api';
import styles from '../styles/RequestListScreenStyles';

const RequestListScreen = () => {
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();

  const fetchRequests = async () => {
    try {
      const response = await getAllRequests();
      setRequests(response);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Re-fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>User: {item.User.fullName}</Text>
      <Text style={styles.requestText}>Medication: {item.Medication.name}</Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add New Request" onPress={() => navigation.navigate('AddRequest')} />
    </View>
  );
};

export default RequestListScreen;