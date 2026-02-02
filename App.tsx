import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import StackNavigation from './OrchardWoodsKingsQueens/navigation/StackNavigation';
import { ContextProvider } from './OrchardWoodsKingsQueens/store/context';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <StackNavigation />
        <Toast position="top" topOffset={45} />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
