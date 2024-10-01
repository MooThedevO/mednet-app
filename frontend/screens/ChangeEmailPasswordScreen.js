import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, Modal, Text } from 'react-native';

import { UserContext } from '../context/UserContext';
import { updateEmailOrPassword } from '../services/api';

import styles from '../styles/changeEmailPasswordStyles';

const ChangeEmailPasswordScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isOldPasswordModalVisible, setOldPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    setEmail(user.email); // Pre-fill email
  }, [user]);

  const handleSubmit = async () => {
    if (!newPassword || newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setOldPasswordModalVisible(true); // Trigger modal for old password input
  };

  const confirmUpdate = async () => {
    if (!oldPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    setOldPasswordModalVisible(false);
    const data = {
      oldPassword,
      newPassword,
      email,
    };

    try {
      // Correct API call with user.id and data object
      await updateEmailOrPassword(user.id, data);
      Alert.alert('Success', 'Email and password updated successfully');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (err) {
      Alert.alert('Error', 'Failed to update email or password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <Button title="Submit" onPress={handleSubmit} />

      {/* Old password modal */}
      <Modal visible={isOldPasswordModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Enter your old password to confirm</Text>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <Button title="Confirm" onPress={confirmUpdate} />
        </View>
      </Modal>
    </View>
  );
};

export default ChangeEmailPasswordScreen;
