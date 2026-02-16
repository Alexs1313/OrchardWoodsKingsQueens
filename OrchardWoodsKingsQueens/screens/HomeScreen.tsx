import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Sound from 'react-native-sound';

import AboutModal from '../components/AboutModal';
import SettingsModal from '../components/SettingsModal';
import { useStore } from '../store/context';
import { unlockRandomPiece } from '../utils/collectionStorage';
import Orientation from 'react-native-orientation-locker';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  GameScreen: { level: number };
  HeroesScreen: undefined;
  CollectionScreen: undefined;
};

type DailyChestRewardOrchardWoods =
  | { type: 'quote'; text: string }
  | { type: 'coins'; amount: number }
  | { type: 'piece'; amount: number };

const STORAGE_TOTAL_WINS_ORCHARD_WOODS = 'BK_WINS_V1';
const STORAGE_TOTAL_COINS_ORCHARD_WOODS = 'BK_COINS_V1';

const STORAGE_DAILY_CHEST_DATE_ORCHARD_WOODS = 'BK_DAILY_CHEST_DATE_V1';
const STORAGE_DAILY_CHEST_PAYLOAD_ORCHARD_WOODS = 'BK_DAILY_CHEST_PAYLOAD_V1';

const STORAGE_RANK_SHOWN_ORCHARD_WOODS = 'BK_RANK_SHOWN_V1';

const RANK_STEP_ORCHARD_WOODS = 5;

const RANKS_ORCHARD_WOODS = [
  'Berry Squire',
  'Berry Knight',
  'Crown Keeper',
  'King of the Grove',
] as const;

const CROWNS_BY_RANK_ORCHARD_WOODS: Record<number, any> = {
  0: require('../../assets/images/crwn1.png'),
  1: require('../../assets/images/crwn2.png'),
  2: require('../../assets/images/crwn3.png'),
  3: require('../../assets/images/crwn4.png'),
};

const QUOTES_ORCHARD_WOODS = [
  'Every small victory strengthens your crown.',
  'Patience turns chance into advantage.',
  'Calm focus brings better outcomes.',
  'Fortune favors steady minds.',
  'One step at a time leads to the throne.',
  'Consistency is the quiet path to mastery.',
  'Even luck respects preparation.',
  'A clear mind makes wiser choices.',
  'Progress is built from many small wins.',
  'Stay calm — the next move may change everything.',
  'A patient player always gains more.',
  'Balance brings better results than haste.',
  'Every round is a chance to improve.',
  'Luck rewards those who keep going.',
  'Confidence grows with every step forward.',
  'A steady hand guides the best decisions.',
  'The crown belongs to those who persist.',
  'Focus turns uncertainty into opportunity.',
  'Winning begins with calm thinking.',
  'Great results come from simple, consistent actions.',
];

function pickOrchardWoods<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function todayKeyOrchardWoods() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function getWinsOrchardWoods() {
  const raw = await AsyncStorage.getItem(STORAGE_TOTAL_WINS_ORCHARD_WOODS);
  const n = raw ? Number(JSON.parse(raw)) : 0;
  return Number.isFinite(n) ? n : 0;
}

function rankIndexFromWinsOrchardWoods(wins: number) {
  return Math.floor(wins / RANK_STEP_ORCHARD_WOODS);
}

function winsInCurrentRankOrchardWoods(wins: number) {
  return wins % RANK_STEP_ORCHARD_WOODS;
}

async function canOpenDailyChestOrchardWoods() {
  const last = await AsyncStorage.getItem(
    STORAGE_DAILY_CHEST_DATE_ORCHARD_WOODS,
  );
  return last !== JSON.stringify(todayKeyOrchardWoods());
}

async function getSavedChestRewardOrchardWoods(): Promise<DailyChestRewardOrchardWoods | null> {
  const raw = await AsyncStorage.getItem(
    STORAGE_DAILY_CHEST_PAYLOAD_ORCHARD_WOODS,
  );
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyChestRewardOrchardWoods;
  } catch {
    return null;
  }
}

async function openDailyChestOrchardWoods(): Promise<DailyChestRewardOrchardWoods> {
  await AsyncStorage.setItem(
    STORAGE_DAILY_CHEST_DATE_ORCHARD_WOODS,
    JSON.stringify(todayKeyOrchardWoods()),
  );

  const r = Math.random();
  let reward: DailyChestRewardOrchardWoods;

  if (r < 0.45) {
    reward = { type: 'quote', text: pickOrchardWoods(QUOTES_ORCHARD_WOODS) };
  } else if (r < 0.85) {
    reward = { type: 'coins', amount: 1 };

    const raw = await AsyncStorage.getItem(STORAGE_TOTAL_COINS_ORCHARD_WOODS);
    const current = raw ? Number(JSON.parse(raw)) : 0;
    const safe = Number.isFinite(current) ? current : 0;

    await AsyncStorage.setItem(
      STORAGE_TOTAL_COINS_ORCHARD_WOODS,
      JSON.stringify(safe + reward.amount),
    );
  } else {
    reward = { type: 'piece', amount: 1 };
    await unlockRandomPiece();
  }

  await AsyncStorage.setItem(
    STORAGE_DAILY_CHEST_PAYLOAD_ORCHARD_WOODS,
    JSON.stringify(reward),
  );

  return reward;
}

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

  // ---- Rank + Daily chest state ----
  const [winsOrchardWoods, setWinsOrchardWoods] = useState(0);

  const [displayRankIdxOrchardWoods, setDisplayRankIdxOrchardWoods] =
    useState(0);

  const [rankUpVisibleOrchardWoods, setRankUpVisibleOrchardWoods] =
    useState(false);

  const [canOpenChestOrchardWoods, setCanOpenChestOrchardWoods] =
    useState(false);

  const [chestPhaseOrchardWoods, setChestPhaseOrchardWoods] = useState<
    'closed' | 'opening' | 'done'
  >('closed');

  const [chestRewardOrchardWoods, setChestRewardOrchardWoods] =
    useState<DailyChestRewardOrchardWoods | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (
        Platform.OS === 'android' &&
        (rulesVisibleOrchardWoods || setupVisibleOrchardWoods)
      ) {
        Orientation.lockToPortrait();
      }

      return () => Orientation.unlockAllOrientations();
    }, [rulesVisibleOrchardWoods, setupVisibleOrchardWoods]),
  );

  const rankNameOrchardWoods = useMemo(() => {
    const safeIdx = Math.min(
      displayRankIdxOrchardWoods,
      RANKS_ORCHARD_WOODS.length - 1,
    );
    return RANKS_ORCHARD_WOODS[safeIdx];
  }, [displayRankIdxOrchardWoods]);

  const crownSourceOrchardWoods = useMemo(() => {
    const safeIdx = Math.min(
      displayRankIdxOrchardWoods,
      Object.keys(CROWNS_BY_RANK_ORCHARD_WOODS).length - 1,
    );
    return (
      CROWNS_BY_RANK_ORCHARD_WOODS[safeIdx] ?? CROWNS_BY_RANK_ORCHARD_WOODS[0]
    );
  }, [displayRankIdxOrchardWoods]);

  const winsInRankOrchardWoods = useMemo(
    () => winsInCurrentRankOrchardWoods(winsOrchardWoods),
    [winsOrchardWoods],
  );

  const progressTextOrchardWoods = `${winsInRankOrchardWoods}/${RANK_STEP_ORCHARD_WOODS}`;

  const progressRatioOrchardWoods =
    winsInRankOrchardWoods / RANK_STEP_ORCHARD_WOODS;

  const chestClosedImgOrchardWoods = require('../../assets/images/chest.png');
  const chestOpenImgOrchardWoods = require('../../assets/images/chestOpen.png');
  const paperImgOrchardWoods = require('../../assets/images/paper.png');
  const rankUpGifOrchardWoods = require('../../assets/images/rankup.gif');

  const coinImgOrchardWoods = require('../../assets/images/coin.png');
  const pieceImgOrchardWoods = require('../../assets/images/scroll.png'); // artifact/scroll

  useEffect(() => {
    playMusicOrchardWoods(musicIndexOrchardWoods);

    return () => {
      if (soundOrchardWoods) {
        soundOrchardWoods.stop(() => {
          soundOrchardWoods.release();
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
        if (errorOrchardWoods) return;

        newGameSoundOrchardWoods.play(successOrchardWoods => {
          if (successOrchardWoods) {
            setMusicIndexOrchardWoods(
              prevIndexOrchardWoods =>
                (prevIndexOrchardWoods + 1) % tracksOrchardWoods.length,
            );
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
      } catch {}
    };

    void setVolumeGameMusicOrchardWoods();
  }, [soundOrchardWoods, setIsEnabledSoundOrchardWoods]);

  useEffect(() => {
    if (soundOrchardWoods) {
      soundOrchardWoods.setVolume(isEnabledSoundOrchardWoods ? 1 : 0);
    }
  }, [isEnabledSoundOrchardWoods, soundOrchardWoods]);

  const loadMusicOrchardWoods = async () => {
    try {
      const musicValueOrchardWoods = await AsyncStorage.getItem('toggleSound');
      const parsedOrchardWoods = musicValueOrchardWoods
        ? JSON.parse(musicValueOrchardWoods)
        : null;

      if (typeof parsedOrchardWoods === 'boolean') {
        setIsEnabledSoundOrchardWoods(parsedOrchardWoods);
      }
    } catch {}
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
    } catch {}
  };

  const maybeShowRankUpOrchardWoods = useCallback(
    async (actualRankIdx: number) => {
      try {
        const raw = await AsyncStorage.getItem(
          STORAGE_RANK_SHOWN_ORCHARD_WOODS,
        );
        const shownIdx = raw ? Number(JSON.parse(raw)) : 0;
        const safeShown = Number.isFinite(shownIdx) ? shownIdx : 0;

        if (actualRankIdx > safeShown) {
          setRankUpVisibleOrchardWoods(true);

          setTimeout(async () => {
            setRankUpVisibleOrchardWoods(false);
            setDisplayRankIdxOrchardWoods(actualRankIdx);
            await AsyncStorage.setItem(
              STORAGE_RANK_SHOWN_ORCHARD_WOODS,
              JSON.stringify(actualRankIdx),
            );
          }, 4000);
        } else {
          setDisplayRankIdxOrchardWoods(actualRankIdx);
        }
      } catch {
        setDisplayRankIdxOrchardWoods(actualRankIdx);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const loadHomeProgressOrchardWoods = async () => {
        const w = await getWinsOrchardWoods();
        setWinsOrchardWoods(w);

        const actualRankIdx = rankIndexFromWinsOrchardWoods(w);
        void maybeShowRankUpOrchardWoods(actualRankIdx);

        const can = await canOpenDailyChestOrchardWoods();
        setCanOpenChestOrchardWoods(can);

        if (!can) {
          const saved = await getSavedChestRewardOrchardWoods();
          setChestRewardOrchardWoods(saved);
          setChestPhaseOrchardWoods('done');
        } else {
          setChestRewardOrchardWoods(null);
          setChestPhaseOrchardWoods('closed');
        }
      };

      void loadMusicOrchardWoods();
      void loadVibrationOrchardWoods();
      void loadHomeProgressOrchardWoods();
    }, [maybeShowRankUpOrchardWoods]),
  );

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
    } catch {}
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

      setWinsOrchardWoods(0);
      setDisplayRankIdxOrchardWoods(0);
      setRankUpVisibleOrchardWoods(false);

      setCanOpenChestOrchardWoods(true);
      setChestPhaseOrchardWoods('closed');
      setChestRewardOrchardWoods(null);
    } catch {}
  };

  const onPressDailyChestOrchardWoods = useCallback(async () => {
    const can = await canOpenDailyChestOrchardWoods();
    if (!can) return;

    setChestPhaseOrchardWoods('opening');

    const reward = await openDailyChestOrchardWoods();
    setChestRewardOrchardWoods(reward);
    setCanOpenChestOrchardWoods(false);

    setTimeout(() => {
      setChestPhaseOrchardWoods('done');
    }, 1800);
  }, []);

  const renderRewardOrchardWoods = () => {
    if (!chestRewardOrchardWoods) return null;

    if (chestRewardOrchardWoods.type === 'quote') {
      return (
        <ImageBackground
          source={paperImgOrchardWoods}
          style={orchardWoodsPaper}
        >
          <Text style={orchardWoodsPaperText}>
            {chestRewardOrchardWoods.text}
          </Text>
        </ImageBackground>
      );
    }

    const icon =
      chestRewardOrchardWoods.type === 'coins'
        ? coinImgOrchardWoods
        : pieceImgOrchardWoods;

    return (
      <View style={orchardWoodsRewardRow}>
        <Image
          source={icon}
          style={{ width: 26, height: 26 }}
          resizeMode="contain"
        />
        <Text style={orchardWoodsRewardRowText}>
          X {chestRewardOrchardWoods.amount}
        </Text>
      </View>
    );
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
            { paddingTop: heightOrchardWoods * 0.04 },
          ]}
        >
          {/* Crown + Rank */}
          <Image
            source={crownSourceOrchardWoods}
            style={{ width: 210, height: 150 }}
            resizeMode="contain"
          />

          <Text style={orchardWoodsRankTitle}>{rankNameOrchardWoods}</Text>

          <Text style={orchardWoodsRankSubtitle}>Wins to Next Rank</Text>

          <ImageBackground
            source={require('../../assets/images/progressBar.png')}
            style={orchardWoodsRankProgressFrame}
            resizeMode="stretch"
          >
            <View style={orchardWoodsRankProgressInnerTrack}>
              <View
                style={[
                  orchardWoodsRankProgressFill,
                  { width: `${progressRatioOrchardWoods * 90}%` },
                ]}
              />
            </View>

            <View style={orchardWoodsRankProgressTextWrap}>
              <Text style={orchardWoodsRankProgressText}>
                {progressTextOrchardWoods}
              </Text>
            </View>
          </ImageBackground>

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
                resizeMode="stretch"
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
                resizeMode="stretch"
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
                resizeMode="stretch"
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
                resizeMode="stretch"
              >
                <Text style={orchardWoodsButtonTitle}>Settings</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Daily chest area */}
          {chestPhaseOrchardWoods === 'closed' && (
            <>
              <Text style={orchardWoodsDailyText}>
                Tap the chest to get daily item
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPressDailyChestOrchardWoods}
                style={{ marginTop: 12 }}
              >
                <Image
                  source={chestClosedImgOrchardWoods}
                  style={{ width: 210, height: 130 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}

          {chestPhaseOrchardWoods === 'opening' && (
            <>
              <Text style={orchardWoodsDailyText}>
                The treasury prepares a{'\n'}new reward for tomorrow.
              </Text>

              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Image
                  source={chestOpenImgOrchardWoods}
                  style={{ width: 210, height: 130 }}
                  resizeMode="contain"
                />
              </View>
            </>
          )}

          {chestPhaseOrchardWoods === 'done' && (
            <>
              <Text style={orchardWoodsDailyText}>
                The treasury prepares a{'\n'}new reward for tomorrow.
              </Text>

              {renderRewardOrchardWoods()}
            </>
          )}

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
              resizeMode="stretch"
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

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setResetVisibleOrchardWoods(false);
                    void handleResetGameProgressOrchardWoods();
                  }}
                >
                  <Image
                    source={require('../../assets/images/homeYesbtn.png')}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>

        <Modal
          visible={rankUpVisibleOrchardWoods}
          transparent
          animationType="fade"
        >
          <View style={orchardWoodsModalBackdrop}>
            <Image
              source={rankUpGifOrchardWoods}
              style={{ width: 320, height: 320 }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

export const NeonModalTall: React.FC<{
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ title, onClose, children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/largeModalHome.png')}
      style={orchardWoodsTallModalOuter}
      resizeMode="stretch"
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

export const NeonModalSquare: React.FC<{
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ title, onClose, children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/homeModalBoard.png')}
      style={orchardWoodsSmallModalOuter}
      resizeMode="stretch"
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
  paddingTop: 30,
};

const orchardWoodsLevelsStack = {
  alignItems: 'center' as const,
  marginTop: 26,
};

const orchardWoodsMenuButton = {
  width: 192,
  height: 70,
  justifyContent: 'center' as const,
};

const orchardWoodsLevelBtnWrap = {
  marginBottom: 16,
};

const orchardWoodsButtonTitle = {
  color: '#FFFFFF',
  fontSize: 20,
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsRankTitle = {
  color: '#FFFFFF',
  fontSize: 26,
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
  marginTop: 6,
};

const orchardWoodsRankSubtitle = {
  color: '#FFFFFF',
  fontSize: 18,
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
  marginTop: 12,
};

const orchardWoodsRankProgressFrame = {
  width: 300,
  height: 30,
  marginTop: 10,
  justifyContent: 'center' as const,
};

const orchardWoodsRankProgressInnerTrack = {
  height: 16,
  marginHorizontal: 10,
  borderRadius: 12,
  overflow: 'hidden' as const,
};

const orchardWoodsRankProgressFill = {
  height: '100%' as const,
  backgroundColor: '#7F3BFF',
  borderRadius: 12,
  right: -30,
  top: -1,
};

const orchardWoodsRankProgressTextWrap = {
  position: 'absolute' as const,
  width: '100%' as const,
  alignItems: 'center' as const,
};

const orchardWoodsRankProgressText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsDailyText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 16,
  textAlign: 'center' as const,
  marginTop: 6,
  paddingHorizontal: 18,
};

const orchardWoodsPaper = {
  width: 241,
  minHeight: 116,
  marginTop: 14,
  paddingHorizontal: 22,
  paddingLeft: 55,
  paddingVertical: 18,
  justifyContent: 'center' as const,
};

const orchardWoodsPaperText = {
  color: '#2A1B12',
  fontFamily: 'Sansation-Bold',
  fontSize: 16,
  textAlign: 'center' as const,
};

const orchardWoodsRewardRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 10,
  marginTop: 14,
};

const orchardWoodsRewardRowText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
};

const orchardWoodsBottomRow = {
  flexDirection: 'row' as const,
  marginTop: 10,
  width: 270,
};

const orchardWoodsModalBackdrop = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 18,
};

const orchardWoodsResetModalOuter = {
  width: 349,
  height: 185,
  resizeMode: 'contain' as const,
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

export default HomeScreen;
