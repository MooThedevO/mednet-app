import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import styles from '../styles/loginStyles';

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  // Clear data and errors on screen load
  useEffect(() => {
    setEmailOrUsername('');
    setPassword('');
    setError('');
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.login({ emailOrUsername, password });
      if (response.data.token) {
        setUser(response.data.user);
        navigation.navigate('HomeTabs');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Email or Username"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text>Don't have an account? Signup here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
