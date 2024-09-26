import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Card, Title, Text } from 'react-native-paper';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/loginStyles';

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // Clear fields and error message whenever the screen is opened
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/auth/login', { emailOrUsername, password });

      const { token, user } = response.data;

      // Store token securely in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      // Update UserContext
      setUser(user);

      // Navigate to HomeTabs
      navigation.navigate('HomeTabs');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error: Login failed';
      setError(errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Login</Title>
          <TextInput
            label="Email or Username"
            value={emailOrUsername}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

export default LoginScreen;
