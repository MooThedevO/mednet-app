import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DonationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donations</Text>
      {/* Placeholder for listing donations */}
      <Text>This is where the donations list will be displayed.</Text>
      <Button title="Add Donation" onPress={() => navigation.navigate('AddDonation')} />
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

export default DonationsScreen;
