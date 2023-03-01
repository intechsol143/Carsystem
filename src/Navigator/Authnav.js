// In App.js in a new project

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Loginscreen'
import Signup from '../Screens/Signupscreen'
import Home from '../Tabscreens/Home';
import auth from '@react-native-firebase/auth';
import AddCar from '../Screens/AddCar';
import EditCar from '../Screens/Editcar';

const Stack = createNativeStackNavigator();

function Authnav() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? <React.Fragment>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} /></React.Fragment>
          :
          <React.Fragment>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddCar" component={AddCar} />
            <Stack.Screen name="EditCar" component={EditCar} />
          </React.Fragment>
        }



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Authnav;