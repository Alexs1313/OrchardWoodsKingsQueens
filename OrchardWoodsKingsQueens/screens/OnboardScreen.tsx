import React, { useState as useStateOrchardWoods } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
};

const ongoalimagesOrchardWoods = [
  require('../../assets/images/introimg1.png'),
  require('../../assets/images/introimg2.png'),
  require('../../assets/images/introimg3.png'),
  require('../../assets/images/introimg4.png'),
] as const;

const onboardDataOrchardWoods = [
  {
    title: 'Enter Orchard Woods',
    descr:
      'Step into a magical berry forest where every run feels like a new story.',
    buttonLabel: 'Next',
  },
  {
    title: 'Choose Your Hero',
    descr:
      'Pick a King or Queen with unique bonuses, extra lives, and better chances.',
    buttonLabel: 'Next',
  },
  {
    title: 'Play 10 Steps',
    descr:
      'Tap to reveal a number and see what happens next—quick, simple, and fun.',
    buttonLabel: 'Next',
  },
  {
    title: 'Collect Artifacts',
    descr:
      'Complete runs to unlock puzzle pieces and reveal beautiful illustrations.',
    buttonLabel: 'Begin',
  },
] as const;

const OnboardScreen: React.FC = () => {
  const { height: heightOrchardWoods } = useWindowDimensions();
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const [currentIndexOrchardWoods, setCurrentIndexOrchardWoods] =
    useStateOrchardWoods<number>(0);

  const handleNextOrchardWoods = () => {
    if (currentIndexOrchardWoods < 3) {
      setCurrentIndexOrchardWoods(prev => prev + 1);
    } else {
      navigationOrchardWoods.navigate('HomeScreen');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={orchardWoodsBg}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            orchardWoodsOrchcont,
            { paddingBottom: heightOrchardWoods * 0.05 },
          ]}
        >
          <ImageBackground
            source={require('../../assets/images/onboardingboard.png')}
            style={orchardWoodsBoardBg}
            resizeMode="contain"
          >
            <View style={orchardWoodsBoardContainer}>
              <Text style={orchardWoodsBoardTitle}>
                {onboardDataOrchardWoods[currentIndexOrchardWoods].title}
              </Text>
              <Text style={orchardWoodsBoardText}>
                {onboardDataOrchardWoods[currentIndexOrchardWoods].descr}
              </Text>
            </View>
          </ImageBackground>

          <Image
            source={ongoalimagesOrchardWoods[currentIndexOrchardWoods]}
            style={[
              orchardWoodsMainImg,
              {
                marginTop: heightOrchardWoods * 0.1,
                marginBottom: heightOrchardWoods * 0.12,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNextOrchardWoods}
          >
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={orchardWoodsOrchnextbtn}
            >
              <Text style={orchardWoodsNextbtntext}>
                {onboardDataOrchardWoods[currentIndexOrchardWoods].buttonLabel}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const orchardWoodsBg = { flex: 1 };

const orchardWoodsOrchcont = {
  flex: 1,
  justifyContent: 'flex-end' as const,
  alignItems: 'center' as const,
};

const orchardWoodsBoardBg = {
  width: 350,
  height: 200,
  marginTop: 20,
};

const orchardWoodsBoardContainer = {
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  padding: 30,
};

const orchardWoodsBoardTitle = {
  fontSize: 22,
  color: '#fff',
  marginBottom: 20,
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsBoardText = {
  fontSize: 20,
  color: '#fff',
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Regular',
};

const orchardWoodsOrchnextbtn = {
  width: 111,
  height: 46,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  marginTop: 40,
};

const orchardWoodsNextbtntext = {
  fontSize: 18,
  color: '#fff',
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsMainImg = {};
export default OnboardScreen;
