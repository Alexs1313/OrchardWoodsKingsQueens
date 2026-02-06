import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AboutModal from '../components/AboutModal';
import { useStore } from '../store/context';
import SettingsModal from '../components/SettingsModal';
import Sound from 'react-native-sound';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  GameScreen: { level: number };
  HeroesScreen: undefined;
  CollectionScreen: undefined;
};

type NeonModalPropsOrchardWoods = {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const HomeScreen: React.FC = () => {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const [rulesVisibleOrchardWoods, setRulesVisibleOrchardWoods] =
    useState<boolean>(false);

  const [setupVisibleOrchardWoods, setSetupVisibleOrchardWoods] =
    useState<boolean>(false);

  const {
    isEnabledVibration: isEnabledVibrationOrchardWoods,
    setIsEnabledVibration: setIsEnabledVibrationOrchardWoods,
    isEnabledSound: isEnabledSoundOrchardWoods,
    setIsEnabledSound: setIsEnabledSoundOrchardWoods,
    isEnabledNotifications: isEnabledNotificationsOrchardWoods,
  } = useStore() as {
    isEnabledVibration: boolean;
    setIsEnabledVibration: (v: boolean) => void;
    isEnabledSound: boolean;
    setIsEnabledSound: (v: boolean) => void;
    isEnabledNotifications: boolean;
    setIsEnabledNotifications: (v: boolean) => void;
  };

  const [resetVisibleOrchardWoods, setResetVisibleOrchardWoods] =
    useState<boolean>(false);

  const { height: heightOrchardWoods } = useWindowDimensions();

  const [musicIndexOrchardWoods, setMusicIndexOrchardWoods] = useState(0);
  const [soundOrchardWoods, setSoundOrchardWoods] = useState<any>(null);

  const tracksOrchardWoods = [
    'medieval-kingdom-354186.mp3',
    'medieval-kingdom-354186.mp3',
  ];

  useEffect(() => {
    playMusicOrchardWoods(musicIndexOrchardWoods);

    return () => {
      if (soundOrchardWoods) {
        soundOrchardWoods.stop(() => {
          soundOrchardWoods.release();
          console.log('sound release!');
        });
      }
    };
  }, [musicIndexOrchardWoods]);

  const playMusicOrchardWoods = (indexOrchardWoods: number) => {
    if (soundOrchardWoods) {
      soundOrchardWoods.stop(() => {
        soundOrchardWoods.release();
      });
    }

    const trackPathOrchardWoods = tracksOrchardWoods[indexOrchardWoods];

    const newGameSoundOrchardWoods = new Sound(
      trackPathOrchardWoods,
      Sound.MAIN_BUNDLE,
      errorOrchardWoods => {
        if (errorOrchardWoods) {
          console.log('Error =>', errorOrchardWoods);
          return;
        }

        newGameSoundOrchardWoods.play(successOrchardWoods => {
          if (successOrchardWoods) {
            setMusicIndexOrchardWoods(
              prevIndexOrchardWoods =>
                (prevIndexOrchardWoods + 1) % tracksOrchardWoods.length,
            );
          } else {
            console.log('Error =>');
          }
        });

        setSoundOrchardWoods(newGameSoundOrchardWoods);
      },
    );
  };

  useEffect(() => {
    const setVolumeGameMusicOrchardWoods = async () => {
      try {
        const savedMusicValueOrchardWoods = await AsyncStorage.getItem(
          'toggleSound',
        );

        const isMusicOnOrchardWoods = JSON.parse(
          savedMusicValueOrchardWoods as any,
        );
        setIsEnabledSoundOrchardWoods(isMusicOnOrchardWoods);

        if (soundOrchardWoods) {
          soundOrchardWoods.setVolume(isMusicOnOrchardWoods ? 1 : 0);
        }
      } catch (errorOrchardWoods) {
        console.error('Error =>', errorOrchardWoods);
      }
    };

    setVolumeGameMusicOrchardWoods();
  }, [soundOrchardWoods]);

  useEffect(() => {
    if (soundOrchardWoods) {
      soundOrchardWoods.setVolume(isEnabledSoundOrchardWoods ? 1 : 0);
    }
  }, [isEnabledSoundOrchardWoods]);

  useFocusEffect(
    useCallback(() => {
      loadMusicOrchardWoods();
      loadVibrationOrchardWoods();
    }, []),
  );

  const loadMusicOrchardWoods = async () => {
    try {
      const musicValueOrchardWoods = await AsyncStorage.getItem('toggleSound');
      const parsedOrchardWoods = musicValueOrchardWoods
        ? JSON.parse(musicValueOrchardWoods)
        : null;

      if (typeof parsedOrchardWoods === 'boolean') {
        setIsEnabledSoundOrchardWoods(parsedOrchardWoods);
      }
    } catch {
      console.log('e music');
    }
  };

  const loadVibrationOrchardWoods = async () => {
    try {
      const vibrValueOrchardWoods = await AsyncStorage.getItem(
        'toggleVibration',
      );

      const parsedOrchardWoods = vibrValueOrchardWoods
        ? JSON.parse(vibrValueOrchardWoods)
        : null;

      if (typeof parsedOrchardWoods === 'boolean') {
        setIsEnabledVibrationOrchardWoods(parsedOrchardWoods);
      }
    } catch {
      console.log('e vibr');
    }
  };

  const toggleVibrationOrchardWoods = async (valueOrchardWoods: boolean) => {
    if (isEnabledNotificationsOrchardWoods) {
      Toast.show({
        type: 'success',
        text1: `Vibration ${valueOrchardWoods ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }

    try {
      await AsyncStorage.setItem(
        'toggleVibration',
        JSON.stringify(valueOrchardWoods),
      );
      setIsEnabledVibrationOrchardWoods(valueOrchardWoods);
    } catch {}
  };

  const toggleMusicOrchardWoods = async (valueOrchardWoods: boolean) => {
    try {
      await AsyncStorage.setItem(
        'toggleSound',
        JSON.stringify(valueOrchardWoods),
      );
      setIsEnabledSoundOrchardWoods(valueOrchardWoods);
    } catch {}
  };

  const handleShareOrchardWoods = async () => {
    try {
      Linking.openURL(
        'https://apps.apple.com/us/app/qu%D0%B5%D0%B5ns%D0%BC%D1%96nn-kings-woods/id6758612386',
      );
    } catch {
      console.log('Error opening the link');
    }
  };

  const handleResetGameProgressOrchardWoods = async () => {
    try {
      await AsyncStorage.clear();
      Toast.show({
        type: 'success',
        text1: 'Game progress has been reset.',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch {
      console.log('Error resetting game progress');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={orchardWoodsBg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            orchardWoodsCenter,
            { paddingTop: heightOrchardWoods * 0.05, height: 800 },
          ]}
        >
          <Image source={require('../../assets/images/homeLlogo.png')} />

          <View style={orchardWoodsLevelsStack}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={orchardWoodsLevelBtnWrap}
              onPress={() =>
                navigationOrchardWoods.navigate('GameScreen', { level: 1 })
              }
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={[orchardWoodsMenuButton, { width: 206, height: 80 }]}
              >
                <Text style={orchardWoodsButtonTitle}>Begin the Journey</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={orchardWoodsLevelBtnWrap}
              onPress={() => navigationOrchardWoods.navigate('HeroesScreen')}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={orchardWoodsMenuButton}
              >
                <Text style={orchardWoodsButtonTitle}>Heroes</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={orchardWoodsLevelBtnWrap}
              onPress={() =>
                navigationOrchardWoods.navigate('CollectionScreen')
              }
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={orchardWoodsMenuButton}
              >
                <Text style={orchardWoodsButtonTitle}>Collection</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={orchardWoodsLevelBtnWrap}
              onPress={() => setSetupVisibleOrchardWoods(true)}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={orchardWoodsMenuButton}
              >
                <Text style={orchardWoodsButtonTitle}>Settings</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={orchardWoodsBottomRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRulesVisibleOrchardWoods(true)}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
        </View>

        <AboutModal
          rulesVisible={rulesVisibleOrchardWoods}
          setRulesVisible={setRulesVisibleOrchardWoods}
        />

        <SettingsModal
          setupVisible={setupVisibleOrchardWoods}
          setRulesVisible={setRulesVisibleOrchardWoods}
          setSetupVisible={setSetupVisibleOrchardWoods}
          isEnabledSound={isEnabledSoundOrchardWoods}
          toggleMusic={toggleMusicOrchardWoods}
          isEnabledVibration={isEnabledVibrationOrchardWoods}
          toggleVibration={toggleVibrationOrchardWoods}
          handleShare={handleShareOrchardWoods}
          resetVisible={resetVisibleOrchardWoods}
          setResetVisible={setResetVisibleOrchardWoods}
          resetProgress={handleResetGameProgressOrchardWoods}
        />

        <Modal
          visible={resetVisibleOrchardWoods}
          transparent
          animationType="fade"
        >
          <View style={orchardWoodsModalBackdrop}>
            <ImageBackground
              source={require('../../assets/images/resetModal.png')}
              style={orchardWoodsResetModalOuter}
            >
              <View style={[orchardWoodsModalInnerSquare, { paddingTop: 42 }]}>
                <View style={orchardWoodsModalHeader}>
                  <Text style={orchardWoodsModalTitle}>
                    Reset Your Progress?
                  </Text>
                </View>
              </View>

              <View style={orchardWoodsBottomButtons}>
                <TouchableOpacity
                  onPress={() => setResetVisibleOrchardWoods(false)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../assets/images/homeNobtn.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image
                    source={require('../../assets/images/homeYesbtn.png')}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

export const NeonModalTall: React.FC<NeonModalPropsOrchardWoods> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/largeModalHome.png')}
      style={orchardWoodsTallModalOuter}
    >
      <View style={orchardWoodsModalInnerTall}>
        <View style={orchardWoodsModalHeader}>
          <Text style={orchardWoodsModalTitle}>{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={orchardWoodsCloseBtn}
          >
            <Image source={require('../../assets/images/closeIcon.png')} />
          </Pressable>
        </View>
        <View>{children}</View>
      </View>
    </ImageBackground>
  );
};

export const NeonModalSquare: React.FC<NeonModalPropsOrchardWoods> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/homeModalBoard.png')}
      style={orchardWoodsSmallModalOuter}
    >
      <View style={orchardWoodsModalInnerSquare}>
        <View style={orchardWoodsModalHeader}>
          <Text style={orchardWoodsModalTitle}>{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={orchardWoodsCloseBtn}
          >
            <Image source={require('../../assets/images/closeIcon.png')} />
          </Pressable>
        </View>
        {children}
      </View>
    </ImageBackground>
  );
};

const orchardWoodsBg = { flex: 1 };

const orchardWoodsCenter = {
  flex: 1,
  alignItems: 'center' as const,
  paddingTop: 40,
};

const orchardWoodsLevelsStack = {
  alignItems: 'center' as const,
  marginTop: 30,
};

const orchardWoodsMenuButton = {
  width: 192,
  height: 70,
  justifyContent: 'center' as const,
};

const orchardWoodsLevelBtnWrap = {
  marginBottom: 16,
};

const orchardWoodsResetModalOuter = {
  width: 349,
  height: 185,
  resizeMode: 'contain' as const,
};

const orchardWoodsButtonTitle = {
  color: '#FFFFFF',
  fontSize: 20,
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsBottomButtons = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  marginTop: 60,
  paddingHorizontal: 50,
};

const orchardWoodsSmallModalOuter = {
  width: 334,
  height: 295,
  resizeMode: 'contain' as const,
};

const orchardWoodsBottomRow = {
  flexDirection: 'row' as const,
  marginTop: 32,
  width: 270,
};

const orchardWoodsModalBackdrop = {
  flex: 1,
  backgroundColor: '#00247273',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 18,
};

const orchardWoodsTallModalOuter = {
  width: 338,
  height: 666,
};

const orchardWoodsModalInnerTall = {
  paddingTop: 28,
  paddingBottom: 18,
  paddingHorizontal: 35,
};

const orchardWoodsModalInnerSquare = {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 8,
};

const orchardWoodsModalHeader = {
  height: 44,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  marginBottom: 10,
};

const orchardWoodsModalTitle = {
  color: '#FFFFFF',
  fontSize: 22,
  fontFamily: 'Sansation-Bold',
  marginTop: 5,
};

const orchardWoodsCloseBtn = {
  position: 'absolute' as const,
  right: -25,
  top: -28,
};

const orchardWoodsSetupRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  paddingHorizontal: 18,
  marginTop: 8,
};

export default HomeScreen;
