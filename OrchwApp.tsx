import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import StackNavigation from './orchwoddsSrc/orchwoddsnvgtn/StackNavigation';
import { ContextProvider } from './orchwoddsSrc/orchwoddsstrgg/context';

const OrchwApp: React.FC = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <StackNavigation />
        <Toast position="top" topOffset={45} />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default OrchwApp;
