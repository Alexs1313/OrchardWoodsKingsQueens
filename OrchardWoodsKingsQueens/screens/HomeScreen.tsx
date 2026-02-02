import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
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

type RootStackParamList = {
  HomeScreen: undefined;
  GameScreen: { level: number };
  HeroesScreen: undefined;
  CollectionScreen: undefined;
};

type NeonModalProps = {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);
  const [setupVisible, setSetupVisible] = useState<boolean>(false);

  const {
    isEnabledVibration,
    setIsEnabledVibration,
    isEnabledSound,
    setIsEnabledSound,
    isEnabledNotifications,
  } = useStore() as {
    isEnabledVibration: boolean;
    setIsEnabledVibration: (v: boolean) => void;
    isEnabledSound: boolean;
    setIsEnabledSound: (v: boolean) => void;
    isEnabledNotifications: boolean;
    setIsEnabledNotifications: (v: boolean) => void;
  };

  const [resetVisible, setResetVisible] = useState<boolean>(false);

  const { height } = useWindowDimensions();
  const [musicIndex, setMusicIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const tracks = ['medieval-kingdom-354186.mp3', 'medieval-kingdom-354186.mp3'];

  useEffect(() => {
    playMusic(musicIndex);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();

          console.log('sound release!');
        });
      }
    };
  }, [musicIndex]);

  const playMusic = (index: number) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const trackPath = tracks[index];

    const newGameSound = new Sound(
      trackPath,

      Sound.MAIN_BUNDLE,

      error => {
        if (error) {
          console.log('Error =>', error);
          return;
        }

        newGameSound.play(success => {
          if (success) {
            setMusicIndex(prevIndex => (prevIndex + 1) % tracks.length);
          } else {
            console.log('Error =>');
          }
        });
        setSound(newGameSound);
      },
    );
  };

  useEffect(() => {
    const setVolumeGameMusic = async () => {
      try {
        const savedMusicValue = await AsyncStorage.getItem('toggleSound');

        const isMusicOn = JSON.parse(savedMusicValue);
        setIsEnabledSound(isMusicOn);
        if (sound) {
          sound.setVolume(isMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error =>', error);
      }
    };

    setVolumeGameMusic();
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(isEnabledSound ? 1 : 0);
    }
  }, [isEnabledSound]);

  useFocusEffect(
    useCallback(() => {
      loadMusic();
      loadVibration();
    }, []),
  );

  const loadMusic = async () => {
    try {
      const musicValue = await AsyncStorage.getItem('toggleSound');
      const parsed = musicValue ? JSON.parse(musicValue) : null;
      if (typeof parsed === 'boolean') setIsEnabledSound(parsed);
    } catch {
      console.log('e music');
    }
  };

  const loadVibration = async () => {
    try {
      const vibrValue = await AsyncStorage.getItem('toggleVibration');

      const parsed = vibrValue ? JSON.parse(vibrValue) : null;

      if (typeof parsed === 'boolean') setIsEnabledVibration(parsed);
    } catch {
      console.log('e vibr');
    }
  };

  const toggleVibration = async (value: boolean) => {
    if (isEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: `Vibration ${value ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }
    try {
      await AsyncStorage.setItem('toggleVibration', JSON.stringify(value));
      setIsEnabledVibration(value);
    } catch {}
  };

  const toggleMusic = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('toggleSound', JSON.stringify(value));
      setIsEnabledSound(value);
    } catch {}
  };

  const handleShare = async () => {
    try {
      Linking.openURL(
        'https://apps.apple.com/us/app/qu%D0%B5%D0%B5ns%D0%BC%D1%96nn-kings-woods/id6758612386',
      );
    } catch {
      console.log('Error opening the link');
    }
  };

  const handleResetGameProgress = async () => {
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
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.center, { paddingTop: height * 0.05, height: 800 }]}
        >
          <Image source={require('../../assets/images/homeLlogo.png')} />
          <View style={styles.levelsStack}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.levelBtnWrap}
              onPress={() => navigation.navigate('GameScreen', { level: 1 })}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={[styles.menuButton, { width: 206, height: 80 }]}
              >
                <Text style={styles.buttonTitle}>Begin the Journey</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.levelBtnWrap}
              onPress={() => navigation.navigate('HeroesScreen')}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={styles.menuButton}
              >
                <Text style={styles.buttonTitle}>Heroes</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.levelBtnWrap}
              onPress={() => navigation.navigate('CollectionScreen')}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={styles.menuButton}
              >
                <Text style={styles.buttonTitle}>Collection</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.levelBtnWrap}
              onPress={() => setSetupVisible(true)}
            >
              <ImageBackground
                source={require('../../assets/images/homemainBtn.png')}
                style={styles.menuButton}
              >
                <Text style={styles.buttonTitle}>Settings</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRulesVisible(true)}
              style={{ flex: 1, marginLeft: 12 }}
            ></TouchableOpacity>
          </View>
        </View>

        <AboutModal
          rulesVisible={rulesVisible}
          setRulesVisible={setRulesVisible}
        />

        <SettingsModal
          setupVisible={setupVisible}
          setRulesVisible={setRulesVisible}
          setSetupVisible={setSetupVisible}
          isEnabledSound={isEnabledSound}
          toggleMusic={toggleMusic}
          isEnabledVibration={isEnabledVibration}
          toggleVibration={toggleVibration}
          handleShare={handleShare}
          resetVisible={resetVisible}
          setResetVisible={setResetVisible}
          resetProgress={handleResetGameProgress}
        />

        <Modal visible={resetVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <ImageBackground
              source={require('../../assets/images/resetModal.png')}
              style={styles.resetModalOuter}
            >
              <View style={[styles.modalInnerSquare, { paddingTop: 42 }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Reset Your Progress?</Text>
                </View>
              </View>

              <View style={styles.bottomButtons}>
                <TouchableOpacity
                  onPress={() => setResetVisible(false)}
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

export const NeonModalTall: React.FC<NeonModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/largeModalHome.png')}
      style={styles.tallModalOuter}
    >
      <View style={styles.modalInnerTall}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Image source={require('../../assets/images/closeIcon.png')} />
          </Pressable>
        </View>
        <View>{children}</View>
      </View>
    </ImageBackground>
  );
};

export const NeonModalSquare: React.FC<NeonModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/homeModalBoard.png')}
      style={styles.smallModalOuter}
    >
      <View style={styles.modalInnerSquare}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Image source={require('../../assets/images/closeIcon.png')} />
          </Pressable>
        </View>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  levelsStack: {
    alignItems: 'center',
    marginTop: 30,
  },
  menuButton: {
    width: 192,
    height: 70,
    justifyContent: 'center',
  },
  levelBtnWrap: {
    marginBottom: 16,
  },
  resetModalOuter: { width: 349, height: 185, resizeMode: 'contain' },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    paddingHorizontal: 50,
  },
  smallModalOuter: {
    width: 334,
    height: 295,
    resizeMode: 'contain',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 32,
    width: 270,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00247273',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  tallModalOuter: {
    width: 338,
    height: 666,
  },
  modalInnerTall: {
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 35,
  },
  modalInnerSquare: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  modalHeader: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Sansation-Bold',
    marginTop: 5,
  },
  closeBtn: {
    position: 'absolute',
    right: -25,
    top: -28,
  },
  setupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 8,
  },
});

export default HomeScreen;
