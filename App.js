import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthContextProvider, { AuthContext } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}

function MainNavigator() {
  const { user } = React.useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}
