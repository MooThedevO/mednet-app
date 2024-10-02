import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { getAllRequests } from '../services/api';
import styles from '../styles/RequestListScreenStyles';

const RequestListScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <Button title="Add New Request" onPress={() => navigation.navigate('AddRequest')} />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}>
              <Text style={styles.detailsButton}>Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default RequestListScreen;
