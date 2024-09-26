import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Details Screen</Title>
          <Text>Here are more details about the application.</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default DetailsScreen;
