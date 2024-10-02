import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getRequest, deleteRequest, fulfillRequest } from '../services/api';
import { UserContext } from '../UserContext';
import styles from '../styles/RequestDetailsScreenStyles';

const RequestDetailsScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const { user } = useContext(UserContext);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getRequest(requestId);
        setRequest(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteRequest(requestId);
              navigation.goBack();
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleFulfill = async () => {
    try {
      await fulfillRequest(requestId, { userId: user.id });
      Alert.alert('Request fulfilled!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {request ? (
        <>
          <Text style={styles.title}>{request.name}</Text>
          <Text>{request.description}</Text>
          {/* Buttons based on user role and ownership */}
          {user.id === request.creatorId || user.role === 'admin' || user.role === 'superadmin' ? (
            <>
              <Button title="Edit" onPress={() => navigation.navigate('UpdateRequest', { requestId })} />
              <Button title="Delete" onPress={handleDelete} />
            </>
          ) : (
            <Button title="Fulfill" onPress={handleFulfill} />
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default RequestDetailsScreen;
