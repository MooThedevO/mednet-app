import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import styles from '../styles/profileStyles';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Title>Profile</Title>
      <Text>This is the profile screen.</Text>
    </View>
  );
};

export default ProfileScreen;
