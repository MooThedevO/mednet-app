import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Modal, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { updateEmailOrPassword } from '../services/api'; // API call function
import styles from '../styles/changeEmailPasswordStyles'; // Assuming styles are imported
import { useNavigation } from '@react-navigation/native';

const ChangeEmailPasswordScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation(); // For navigating to ProfileScreen
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

  // Clear inputs when screen loads
  useEffect(() => {
    setEmail(user.email);
    setNewPassword('');
    setOldPassword('');
  }, [user]);

  const handleUpdate = async () => {
    if (!email || !oldPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const data = { oldPassword, newEmail: email, newPassword };

    try {
      await updateEmailOrPassword(user.id, data);
      Alert.alert('Success', 'Your email and/or password have been updated');
      navigation.navigate('Profile'); // Navigate back to Profile on success
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to update details');
    }
  };

  const confirmUpdate = () => {
    setPasswordModalVisible(true); // Show the modal asking for old password
  };

  return (
    <View style={styles.container}>
      {/* Title and Back Button */}
      <View style={styles.header}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Change Email or Password</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="New Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <Button title="Update" onPress={confirmUpdate} />

      {/* Modal for old password confirmation */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter your old password to confirm</Text>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <Button title="Confirm" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setPasswordModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangeEmailPasswordScreen;
