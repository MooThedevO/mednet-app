import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RequestsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      {/* Placeholder for requests listing */}
      <Text>This is where user requests will be displayed.</Text>
      <Button title="Create Request" onPress={() => navigation.navigate('CreateRequest')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RequestsScreen;
