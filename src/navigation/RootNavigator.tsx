import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { usePetsHub } from '../context/PetsHubContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AdminNavigator } from './AdminNavigator';
import { CustomerNavigator } from './CustomerNavigator';

export const RootNavigator: React.FC = () => {
  const { currentUser } = usePetsHub();

  return (
    <NavigationContainer>
      {!currentUser ? (
        <LoginScreen />
      ) : currentUser.role === 'ADMIN' ? (
        <AdminNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
};
