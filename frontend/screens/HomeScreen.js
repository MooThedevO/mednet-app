import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';
import styles from '../styles/homeStyles';  // Import styles

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome to MedNet</Title>
          <Text>Find the medicines you need or donate unused medicines.</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Details')}
      >
        Go to Details
      </Button>
    </View>
  );
};

export default HomeScreen;
