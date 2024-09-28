import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/profileStyles';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
    </View>
  );
};

export default ProfileScreen;
