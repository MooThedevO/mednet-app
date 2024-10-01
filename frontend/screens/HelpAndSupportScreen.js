import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HelpAndSupportScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help and Support</Text>
      <Text>If you need help, contact our support team!</Text>
      <Button title="Contact Support" onPress={() => navigation.navigate('ContactSupport')} />
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

export default HelpAndSupportScreen;
