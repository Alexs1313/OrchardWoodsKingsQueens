import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../[orchwoddscmpnts]/Loader';
import OnboardScreen from '../orchwoddsscrnns/OnboardScreen';
import HomeScreen from '../orchwoddsscrnns/HomeScreen';
import GameScreen from '../orchwoddsscrnns/GameScreen';
import HeroesScreen from '../orchwoddsscrnns/HeroesScreen';
import Orchwddscollectn from '../orchwoddsscrnns/Orchwddscollectn';
import OrchwddscollectnDetail from '../orchwoddsscrnns/OrchwddscollectnDetail';
import Orchrdwddscollectn from '../orchwoddsscrnns/Orchrdwddscollectn';

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
