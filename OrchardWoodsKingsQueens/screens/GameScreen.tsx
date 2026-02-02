import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { unlockRandomPiece } from '../utils/collectionStorage';
import { useStore } from '../store/context';
import { EASY_EVENTS, HARD_EVENTS, MEDIUM_EVENTS } from '../data/levels';

import { HEROES, type HeroId, type Hero } from '../data/heroes';

type RootStackParamList = {
  Home: undefined;
  GamePlay: { heroId?: number; difficulty?: Difficulty } | undefined;
};

type Difficulty = 'easy' | 'medium' | 'hard';

function randomDifficulty(): Difficulty {
  const r = Math.random();
  if (r < 0.34) return 'easy';
  if (r < 0.67) return 'medium';
  return 'hard';
}

const STORAGE_TOTAL_COINS = 'BK_COINS_V1';
const HERO_STATE_KEY = 'BK_HERO_STATE_V1';

const HERO_INDEX: Record<HeroId, number> = {
  rowan: 0,
  elowen: 1,
  bramble: 2,
  nylara: 3,
};

type EventCard = {
  id: string;
  title: string;
  event: string;
  outcomes: { bad: string; neutral: string; good: string };
};

const DIFF = {
  easy: {
    key: 'easy' as const,
    title: 'Easy',
    frame: require('../../assets/images/greenframe.png'),
  },
  medium: {
    key: 'medium' as const,
    title: 'Medium',
    frame: require('../../assets/images/purpleframe.png'),
  },
  hard: {
    key: 'hard' as const,
    title: 'Hard',
    frame: require('../../assets/images/redframe.png'),
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rollD10() {
  return Math.floor(Math.random() * 10) + 1;
}
function getEventPool(d: Difficulty) {
  if (d === 'easy') return EASY_EVENTS as any;
  if (d === 'medium') return MEDIUM_EVENTS as any;
  return HARD_EVENTS as any;
}
function calcOutcome(d: Difficulty, roll: number) {
  if (d === 'easy') {
    if (roll <= 3) return 'bad' as const;
    if (roll <= 6) return 'neutral' as const;
    return 'good' as const;
  }
  if (d === 'medium') {
    if (roll <= 4) return 'bad' as const;
    if (roll <= 7) return 'neutral' as const;
    return 'good' as const;
  }
  if (roll <= 5) return 'bad' as const;
  if (roll <= 8) return 'neutral' as const;
  return 'good' as const;
}

export default function GameScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isEnabledVibration } = useStore();
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId>('rowan');
  const hero: Hero = useMemo(() => {
    const idx = HERO_INDEX[selectedHeroId] ?? 0;
    return HEROES[idx] ?? HEROES[0];
  }, [selectedHeroId]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [step, setStep] = useState<number>(1);
  const [lives, setLives] = useState<number>(hero.lives);
  const [runCoins, setRunCoins] = useState<number>(0);
  const [card, setCard] = useState<EventCard>(() =>
    pickRandom(getEventPool('medium')),
  );
  const [rolled, setRolled] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<'bad' | 'neutral' | 'good' | null>(
    null,
  );

  const [leaveVisible, setLeaveVisible] = useState(false);
  const [roundEndVisible, setRoundEndVisible] = useState(false);
  const [roundEndTitle, setRoundEndTitle] = useState('Well Done!');
  const [roundEndText, setRoundEndText] = useState('');
  const [roundEndCoins, setRoundEndCoins] = useState(0);

  const pendingLeaveRef = useRef(false);
  const diffUI = DIFF[difficulty];

  const dots = useMemo(
    () => Array.from({ length: 10 }).map((_, i) => i + 1),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const loadSelectedHero = async () => {
        try {
          const raw = await AsyncStorage.getItem(HERO_STATE_KEY);
          if (!raw) return;

          const parsed = JSON.parse(raw) as { selected?: HeroId };
          const nextId = parsed.selected;

          if (nextId && HERO_INDEX[nextId] !== undefined) {
            setSelectedHeroId(nextId);

            setLives(HEROES[HERO_INDEX[nextId]].lives);
          } else {
            setSelectedHeroId('rowan');
            setLives(HEROES[0].lives);
          }
        } catch {
          console.log('catch errror');
        }
      };

      void loadSelectedHero();
    }, []),
  );

  const canRoll = rolled === null && lives > 0 && step <= 10;
  const canNext = rolled !== null && lives > 0 && step < 10;
  const isLastStepDone = rolled !== null && step === 10;

  const computeHardGoodRewardText = (currentLives: number) => {
    if (currentLives >= hero.lives) return '+5 coins';
    return '+1 life';
  };

  const startNewRun = useCallback(() => {
    const d = randomDifficulty();
    setDifficulty(d);

    setStep(1);
    setLives(hero.lives);
    setRunCoins(0);
    setRolled(null);
    setOutcome(null);

    setCard(pickRandom(getEventPool(d)));
  }, [hero.lives]);

  useEffect(() => {
    startNewRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetRun = useCallback(() => {
    setRoundEndVisible(false);
    setLeaveVisible(false);
    pendingLeaveRef.current = false;

    startNewRun();
  }, [startNewRun]);

  const applyEconomyAndResult = useCallback(
    async (d: Difficulty, roll: number, o: 'bad' | 'neutral' | 'good') => {
      let nextLives = lives;
      let coinsDelta = 0;

      if (o === 'bad') {
        nextLives = Math.max(0, lives - 1);
        coinsDelta = 0;
      } else {
        coinsDelta = 1;
      }

      if (o === 'good') {
        if (d === 'medium') coinsDelta += 3;

        if (d === 'hard') {
          if (lives >= hero.lives) {
            coinsDelta += 5;
          } else {
            nextLives = Math.min(hero.lives, nextLives + 1);
          }
        }
      }

      setLives(nextLives);
      setRunCoins(prev => prev + coinsDelta);

      const finished = step === 10 || nextLives <= 0;

      if (finished) {
        const fixedBonus = hero.fixedBonusCoins;
        const winBonus = step === 10 && nextLives >= 1 ? 5 : 0;
        const totalAdded = runCoins + coinsDelta + fixedBonus + winBonus;

        try {
          const raw = await AsyncStorage.getItem(STORAGE_TOTAL_COINS);
          const currentTotal = raw ? Number(JSON.parse(raw)) : 0;
          const safeTotal = Number.isFinite(currentTotal) ? currentTotal : 0;
          const nextTotal = safeTotal + totalAdded;

          await AsyncStorage.setItem(
            STORAGE_TOTAL_COINS,
            JSON.stringify(nextTotal),
          );
        } catch {}

        try {
          await unlockRandomPiece();
        } catch {}

        setRoundEndCoins(totalAdded);

        if (nextLives <= 0) {
          setRoundEndTitle('So close!');
          setRoundEndText('The path was tough, but you’ll return stronger.');
        } else {
          setRoundEndTitle('Well Done!');
          setRoundEndText('The Berry Kingdom smiles on you today.');
        }

        setRoundEndVisible(true);
      }
    },
    [hero.fixedBonusCoins, hero.lives, lives, runCoins, step],
  );

  const onPressRoll = useCallback(() => {
    if (!canRoll) return;
    isEnabledVibration && Vibration.vibrate(100);

    const r = rollD10();
    const o = calcOutcome(difficulty, r);

    setRolled(r);
    setOutcome(o);

    void applyEconomyAndResult(difficulty, r, o);
  }, [applyEconomyAndResult, canRoll, difficulty, isEnabledVibration]);

  const onNextStep = useCallback(() => {
    if (!canNext) return;

    setStep(prev => prev + 1);
    setRolled(null);
    setOutcome(null);
    setCard(pickRandom(getEventPool(difficulty)));
  }, [canNext, difficulty]);

  const confirmLeave = useCallback(() => {
    setLeaveVisible(false);
    pendingLeaveRef.current = false;
    navigation.goBack();
  }, [navigation]);

  const askLeave = useCallback(() => {
    setLeaveVisible(true);
    pendingLeaveRef.current = true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        askLeave();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, [askLeave]),
  );

  const resultLine = useMemo(() => {
    if (rolled === null || !outcome) return null;

    if (difficulty === 'hard' && outcome === 'good') {
      return `Rare reward: ${computeHardGoodRewardText(lives)}`;
    }
    return (card as any).outcomes[outcome];
  }, [card, difficulty, lives, outcome, rolled]);

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, height: 800 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCardWrap}>
          <ImageBackground
            source={diffUI.frame}
            style={styles.topCard}
            resizeMode="stretch"
          >
            <Text style={styles.cardTitle}>{card.title}</Text>

            <Text style={styles.cardEventText}>{card.event}</Text>

            {!!resultLine && (
              <Text style={styles.cardResultText}>{resultLine}</Text>
            )}

            <View style={styles.dotsRow}>
              {dots.map(n => {
                const active = n <= step;
                return (
                  <View
                    key={n}
                    style={[styles.dot, active && styles.dotActive]}
                  />
                );
              })}
            </View>
          </ImageBackground>
        </View>

        <View style={styles.centerWrap}>
          <ImageBackground
            source={require('../../assets/images/purpleBadge.png')}
            style={styles.badge}
            resizeMode="contain"
          >
            <Text style={styles.badgeText}>{rolled ?? '?'}</Text>
          </ImageBackground>

          <View style={styles.heroWrap}>
            <Image
              source={hero.image}
              style={styles.heroImg}
              resizeMode="contain"
            />

            <ImageBackground
              source={require('../../assets/images/heart.png')}
              style={styles.livesBubble}
            >
              <Text style={styles.livesText}>{lives}</Text>
            </ImageBackground>
          </View>
        </View>

        <View style={styles.bottomButtonsArea}>
          {canRoll ? (
            <View>
              <TouchableOpacity activeOpacity={0.9} onPress={onPressRoll}>
                <ImageBackground
                  source={require('../../assets/images/introBtn.png')}
                  style={styles.mainBtn}
                  resizeMode="stretch"
                >
                  <Text style={styles.mainBtnText}>Start</Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} onPress={askLeave}>
                <ImageBackground
                  source={require('../../assets/images/homebtn.png')}
                  style={[
                    styles.homeBtn,
                    { marginTop: 12, alignSelf: 'center' },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.afterRollRow}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onNextStep}
                disabled={!canNext}
              >
                <ImageBackground
                  source={require('../../assets/images/introBtn.png')}
                  style={[styles.mainBtn, !canNext && { opacity: 0.55 }]}
                  resizeMode="stretch"
                >
                  <Text style={styles.mainBtnText}>
                    {isLastStepDone ? 'Finish' : 'Next'}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <View style={{ height: 12 }} />

              <TouchableOpacity activeOpacity={0.9} onPress={askLeave}>
                <ImageBackground
                  source={require('../../assets/images/homebtn.png')}
                  style={styles.homeBtn}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal
          visible={leaveVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLeaveVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <ImageBackground
              source={require('../../assets/images/resetModal.png')}
              style={styles.leaveModal}
              resizeMode="stretch"
            >
              <Text style={styles.leaveTitle}>Leave the Game?</Text>

              <View style={styles.leaveBtnsRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setLeaveVisible(false);
                    pendingLeaveRef.current = false;
                  }}
                >
                  <Image
                    source={require('../../assets/images/homeNobtn.png')}
                    style={styles.leaveIconBtn}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} onPress={confirmLeave}>
                  <Image
                    source={require('../../assets/images/homeYesbtn.png')}
                    style={styles.leaveIconBtn}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>

        <Modal
          visible={roundEndVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setRoundEndVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <ImageBackground
              source={
                lives <= 0
                  ? require('../../assets/images/losemodal.png')
                  : require('../../assets/images/winmodal.png')
              }
              style={styles.resultModal}
              resizeMode="stretch"
            >
              <Text style={styles.resultTitle}>{roundEndTitle}</Text>
              <Text style={styles.resultBody}>{roundEndText}</Text>

              <View style={styles.resultCoinsRow}>
                <Image source={require('../../assets/images/coin.png')} />
                {lives <= 0 ? (
                  <Text style={styles.resultCoinsText}>{`x ${2}`}</Text>
                ) : (
                  <Text
                    style={styles.resultCoinsText}
                  >{`x ${roundEndCoins}`}</Text>
                )}
              </View>

              {lives > 0 && (
                <View style={styles.resultCoinsRow}>
                  <Image source={require('../../assets/images/artifact.png')} />
                  <Text style={styles.resultCoinsText}>{`x ${1}`}</Text>
                </View>
              )}
            </ImageBackground>

            <View style={{ height: 14 }} />

            <TouchableOpacity activeOpacity={0.9} onPress={resetRun}>
              <ImageBackground
                source={require('../../assets/images/introBtn.png')}
                style={styles.mainBtn}
                resizeMode="stretch"
              >
                <Text style={styles.mainBtnText}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>

            <View style={{ height: 10 }} />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
            >
              <ImageBackground
                source={require('../../assets/images/homebtn.png')}
                style={styles.homeBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  topCardWrap: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    zIndex: 10,
  },
  topCard: {
    width: 263,
    height: 250,
    paddingTop: 25,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardEventText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 20,
  },
  cardResultText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },

  dotsRow: {
    position: 'absolute',
    bottom: 23,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  dotActive: {
    backgroundColor: '#FED546',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 140,
  },

  badge: {
    width: 105,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
  },

  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImg: {
    width: 220,
    height: 260,
  },

  livesBubble: {
    position: 'absolute',
    right: 40,
    top: 0,
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livesText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },

  bottomButtonsArea: {
    position: 'absolute',
    bottom: 46,
    width: '100%',
    alignItems: 'center',
  },

  mainBtn: {
    width: 180,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
  },

  afterRollRow: {
    alignItems: 'center',
  },

  homeBtn: {
    width: 54,
    height: 54,
  },

  progressText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
    opacity: 0.9,
  },
  coinsText: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: '#153b7753',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  leaveModal: {
    width: 340,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  leaveTitle: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
    marginBottom: 18,
  },
  leaveBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    top: 70,
  },
  leaveIconBtn: {
    width: 54,
    height: 54,
  },

  resultModal: {
    width: 307,
    height: 297,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 35,
  },
  resultTitle: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
    marginBottom: 50,
    textAlign: 'center',
  },
  resultBody: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
    paddingHorizontal: 18,
  },
  resultCoinsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultCoinsText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
  },
});
