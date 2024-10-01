import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { UserProvider, UserContext } from './context/UserContext';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChangeEmailPasswordScreen from './screens/ChangeEmailPasswordScreen';
import DonationsScreen from './screens/DonationsScreen';
import RequestsScreen from './screens/RequestsScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import FAQScreen from './screens/FAQScreen';
import HelpAndSupportScreen from './screens/HelpAndSupportScreen';

// Stack Navigator for Login, Signup, and Email Verification
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
    <AuthStack.Screen name="EmailVerification" component={EmailVerificationScreen} />
  </AuthStack.Navigator>
);

// Drawer Navigator for Home, Profile, and other screens
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Donations" component={DonationsScreen} />
    <Drawer.Screen name="Requests" component={RequestsScreen} />
    <Drawer.Screen name="About Us" component={AboutUsScreen} />
    <Drawer.Screen name="FAQ" component={FAQScreen} />
    <Drawer.Screen name="Help and Support" component={HelpAndSupportScreen} />
  </Drawer.Navigator>
);

// Stack Navigator to include other screens
const RootStack = createStackNavigator();
const RootStackScreen = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Drawer" component={DrawerScreen} />
    <RootStack.Screen name="ChangeEmailPassword" component={ChangeEmailPasswordScreen} />
  </RootStack.Navigator>
);

const AppContent = () => {
  const { user } = useContext(UserContext); // Ensuring that UserContext is accessed properly

  // Conditionally render based on whether the user is logged in
  return (
    <NavigationContainer>
      {user ? <RootStackScreen /> : <AuthStackScreen />}
      </NavigationContainer>
  );
};

const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
