import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import api from '../services/api';
import styles from '../styles/emailVerificationStyles';

const EmailVerificationScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerifyEmail = async () => {
    try {
      const response = await api.verifyEmail(token);
      if (response.data.message) {
        alert('Email verified successfully! You can now log in.');
        navigation.navigate('Login');
      } else {
        setErrorMessage(response.data.message || 'Verification failed');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Email Verification</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        placeholder="Verification Code"
        value={token}
        onChangeText={setToken}
        style={styles.input}
      />
      <Button title="Verify Email" onPress={handleVerifyEmail} />
    </View>
  );
};

export default EmailVerificationScreen;
