import React, { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

type RootStackParamList = {
  HomeScreen: undefined;
};

const ongoalimages = [
  require('../../assets/images/introimg1.png'),
  require('../../assets/images/introimg2.png'),
  require('../../assets/images/introimg3.png'),
  require('../../assets/images/introimg4.png'),
] as const;

const onboardData = [
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
  const { height } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    if (currentIndex < 3) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.orchcont, { paddingBottom: height * 0.05 }]}>
          <ImageBackground
            source={require('../../assets/images/onboardingboard.png')}
            style={{
              width: 350,
              height: 200,
              marginTop: 20,
            }}
            resizeMode="contain"
          >
            <View style={styles.boardContainer}>
              <Text style={styles.boardTitle}>
                {onboardData[currentIndex].title}
              </Text>
              <Text style={styles.boardText}>
                {onboardData[currentIndex].descr}
              </Text>
            </View>
          </ImageBackground>

          <Image
            source={ongoalimages[currentIndex]}
            style={{ marginTop: height * 0.1, marginBottom: height * 0.12 }}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={handleNext}>
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={styles.orchnextbtn}
            >
              <Text style={styles.nextbtntext}>
                {onboardData[currentIndex].buttonLabel}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  orchcont: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  boardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  boardTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Sansation-Bold',
  },
  boardText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Sansation-Regular',
  },
  orchnextbtn: {
    width: 111,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  nextbtntext: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Sansation-Bold',
  },
});

export default OnboardScreen;
