import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAllDonations, deleteDonation } from '../services/api';
import styles from '../styles/donationsStyles';

const DonationsScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getAllDonations();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDeleteDonation = (donationId) => {
    Alert.alert(
      'Delete Donation',
      'Are you sure you want to delete this donation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => confirmDeleteDonation(donationId) },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteDonation = async (donationId) => {
    try {
      await deleteDonation(donationId);
      fetchDonations();
    } catch (error) {
      console.error('Error deleting donation', error);
    }
  };

  const renderDonationItem = ({ item }) => (
    <View style={styles.donationItem}>
      <Text style={styles.donationText}>{item.medication.name}</Text>
      <Text style={styles.donationText}>Quantity: {item.quantity}</Text>
      <TouchableOpacity onPress={() => handleDeleteDonation(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateDonation', { donationId: item.id })}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Donations</Text>
      <FlatList
        data={donations}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Donation" onPress={() => navigation.navigate('AddDonation')} />
    </View>
  );
};

export default DonationsScreen;
