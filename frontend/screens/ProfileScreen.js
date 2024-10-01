import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, Modal } from 'react-native';

import { UserContext } from '../context/UserContext';
import { getUserProfile, updateUserProfile, deleteUser } from '../services/api';

import * as ImagePicker from 'react-native-image-picker'; 
import styles from '../styles/profileStyles'; 

const ProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // States for modals and input fields
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmUsername, setConfirmUsername] = useState('');
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.id);
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load profile');
      }
    };

    loadProfile();
  }, [user]);

  //handle update profile
  const handleUpdateProfile = async () => {
    setPasswordModalVisible(true); // Show modal to confirm password
  };

  const confirmProfileUpdate = async () => {
    setPasswordModalVisible(false); // Hide modal after input

    if (!password) {
      Alert.alert('Error', 'Please enter your password to confirm changes.');
      return;
    }

    try {
      await updateUserProfile(user.id, { ...profileData, password });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };
  
  //handle delete user
  const handleDeleteUser = async () => {
    setDeleteModalVisible(true); // Show modal to confirm username
  };

  const confirmUserDeletion = async () => {
    if (confirmUsername !== user.username) {
      Alert.alert('Error', 'Username does not match');
      return;
    }
    try {
      await deleteUser(user.id);
      setUser(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  //handle image pick
  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0]?.uri;
        setProfileData({ ...profileData, image: uri });
      }
    });
  };

  const placeholderImage = 'https://via.placeholder.com/100'; 
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image source={{ uri: profileData.image || placeholderImage }} style={styles.profileImage} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profileData.fullName}
        onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={profileData.address}
        onChangeText={(text) => setProfileData({ ...profileData, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={profileData.phoneNumber}
        onChangeText={(text) => setProfileData({ ...profileData, phoneNumber: text })}
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button
        title="Change Email or Password"
        onPress={() => navigation.navigate('ChangeEmailPassword')}
      />
      <Button title="Delete Account" onPress={handleDeleteUser} color="red" />
      {/* Modal for confirming password */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter your password to confirm changes</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Button title="Confirm" onPress={confirmProfileUpdate} />
            <Button title="Cancel" onPress={() => setPasswordModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {/* Modal for confirming username */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Type your username to confirm deletion</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={confirmUsername}
              onChangeText={(text) => setConfirmUsername(text)}
            />
            <Button title="Confirm" onPress={confirmUserDeletion} color="red" />
            <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
