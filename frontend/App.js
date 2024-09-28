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
  </Drawer.Navigator>
);

const AppContent = () => {
  const { user } = useContext(UserContext); // Ensuring that UserContext is accessed properly

  // Conditionally render based on whether the user is logged in
  return (
    <NavigationContainer>
      {user ? <DrawerScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

const App = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;
