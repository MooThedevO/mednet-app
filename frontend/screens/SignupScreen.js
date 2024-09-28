import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import { launchImageLibrary } from 'react-native-image-picker'; // Importing from react-native-image-picker
import styles from '../styles/signupStyles';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [roleName, setRoleName] = useState('user');
  const [profilePicture, setProfilePicture] = useState(null); // Store image URI
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  // Clear data and errors on screen load
  useEffect(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setFullName('');
    setPhoneNumber('');
    setAddress('');
    setError('');
  }, []);

  // Function to open the image picker
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setProfilePicture(selectedImage.uri); // Set the image URI
      }
    });
  };

  const handleSignup = async () => {
    try {
      const userData = {
        username,
        email,
        password,
        fullName,
        phoneNumber,
        address,
        roleName,
        profilePicture, // Send profile picture URI
      };
      const response = await api.signup(userData);

      if (response.data.user) {
        setUser(response.data.user);
        navigation.navigate('EmailVerification');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.buttonText}>
          {profilePicture ? 'Change Profile Picture' : 'Pick Profile Picture'}
        </Text>
      </TouchableOpacity>

      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      )}

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
