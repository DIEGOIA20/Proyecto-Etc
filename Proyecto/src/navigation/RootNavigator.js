import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../utils/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      setIsReady(true);
    }, 500);
  }, []);

  if (!isReady || loading) {
    return null; // O mostrar una pantalla de splash
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
