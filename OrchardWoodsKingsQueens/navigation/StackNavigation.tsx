import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../components/Loader';
import OnboardScreen from '../screens/OnboardScreen';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import HeroesScreen from '../screens/HeroesScreen';
import CollectionScreen from '../screens/CollectionScreen';

export type RootStackParamList = {
  Loader: undefined;
  OnboardScreen: undefined;
  HomeScreen: undefined;
  GameScreen: undefined;
  HeroesScreen: undefined;
  CollectionScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Loader" component={Loader} />
      <Stack.Screen name="OnboardScreen" component={OnboardScreen} /> */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="HeroesScreen" component={HeroesScreen} />
      <Stack.Screen name="CollectionScreen" component={CollectionScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
