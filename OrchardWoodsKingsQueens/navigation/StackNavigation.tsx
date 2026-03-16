import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../components/Loader';
import OnboardScreen from '../screens/OnboardScreen';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import HeroesScreen from '../screens/HeroesScreen';
import Orchwddscollectn from '../screens/Orchwddscollectn';
import OrchwddscollectnDetail from '../screens/OrchwddscollectnDetail';
import Orchrdwddscollectn from '../screens/Orchrdwddscollectn';

export type RootStackParamList = {
  Loader: undefined;
  OnboardScreen: undefined;
  HomeScreen: undefined;
  GameScreen: undefined;
  HeroesScreen: undefined;
  CollectionScreen: undefined;
  Orchwddscollectn: undefined;
  CollectionLegendDetails: { legendId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loader" component={Loader} />
      <Stack.Screen name="OnboardScreen" component={OnboardScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="Orchwddscollectn" component={Orchwddscollectn} />
      <Stack.Screen name="HeroesScreen" component={HeroesScreen} />
      <Stack.Screen name="Orchrdwddscollectn" component={Orchrdwddscollectn} />
      <Stack.Screen
        name="CollectionLegendDetails"
        component={OrchwddscollectnDetail}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
