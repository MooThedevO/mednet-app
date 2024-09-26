import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { UserContext } from '../context/UserContext';
import styles from '../styles/loginStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    setUser({ email });
    navigation.navigate('HomeTabs'); // Navigate to HomeTabs after login
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Login</Title>
          <TextInput
            label="Email"
            value={email}
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
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

export default LoginScreen;
