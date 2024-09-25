import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import api from '../services/api';  // Import your API service

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/users');
        setData(response.data);  // Update state with fetched data
        setLoading(false);  // Set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Home Screen</Text>

      {/* Show data if available */}
      <Text>{data ? JSON.stringify(data) : 'No data available'}</Text>

      {/* Button to navigate to Details screen */}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

export default HomeScreen;
