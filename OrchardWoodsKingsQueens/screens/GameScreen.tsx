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

type RootStackParamListOrchardWoods = {
  Home: undefined;
  GamePlay:
    | { heroId?: number; difficulty?: DifficultyOrchardWoods }
    | undefined;
};

type DifficultyOrchardWoods = 'easy' | 'medium' | 'hard';

function randomDifficultyOrchardWoods(): DifficultyOrchardWoods {
  const rOrchardWoods = Math.random();
  if (rOrchardWoods < 0.34) return 'easy';
  if (rOrchardWoods < 0.67) return 'medium';
  return 'hard';
}

const STORAGE_TOTAL_COINS_ORCHARD_WOODS = 'BK_COINS_V1';
const STORAGE_TOTAL_WINS_ORCHARD_WOODS = 'BK_WINS_V1';

const HERO_STATE_KEY_ORCHARD_WOODS = 'BK_HERO_STATE_V1';

const HERO_INDEX_ORCHARD_WOODS: Record<HeroId, number> = {
  rowan: 0,
  elowen: 1,
  bramble: 2,
  nylara: 3,
};

type EventCardOrchardWoods = {
  id: string;
  title: string;
  event: string;
  outcomes: { bad: string; neutral: string; good: string };
};

const DIFF_ORCHARD_WOODS = {
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

function pickRandomOrchardWoods<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rollD10OrchardWoods() {
  return Math.floor(Math.random() * 10) + 1;
}
function getEventPoolOrchardWoods(d: DifficultyOrchardWoods) {
  if (d === 'easy') return EASY_EVENTS as any;
  if (d === 'medium') return MEDIUM_EVENTS as any;
  return HARD_EVENTS as any;
}
function calcOutcomeOrchardWoods(d: DifficultyOrchardWoods, roll: number) {
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

async function getWinsOrchardWoods() {
  const raw = await AsyncStorage.getItem(STORAGE_TOTAL_WINS_ORCHARD_WOODS);
  const n = raw ? Number(JSON.parse(raw)) : 0;
  return Number.isFinite(n) ? n : 0;
}

async function addWinOrchardWoods() {
  const current = await getWinsOrchardWoods();
  const next = current + 1;
  await AsyncStorage.setItem(
    STORAGE_TOTAL_WINS_ORCHARD_WOODS,
    JSON.stringify(next),
  );
  return next;
}

function rankIndexFromWinsOrchardWoods(wins: number) {
  return Math.floor(wins / 5);
}

export default function GameScreen() {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const { isEnabledVibration: isEnabledVibrationOrchardWoods } = useStore();

  const [selectedHeroIdOrchardWoods, setSelectedHeroIdOrchardWoods] =
    useState<HeroId>('rowan');

  const heroOrchardWoods: Hero = useMemo(() => {
    const idxOrchardWoods =
      HERO_INDEX_ORCHARD_WOODS[selectedHeroIdOrchardWoods] ?? 0;
    return HEROES[idxOrchardWoods] ?? HEROES[0];
  }, [selectedHeroIdOrchardWoods]);

  const [difficultyOrchardWoods, setDifficultyOrchardWoods] =
    useState<DifficultyOrchardWoods>('medium');

  const [stepOrchardWoods, setStepOrchardWoods] = useState<number>(1);
  const [livesOrchardWoods, setLivesOrchardWoods] = useState<number>(
    heroOrchardWoods.lives,
  );
  const [runCoinsOrchardWoods, setRunCoinsOrchardWoods] = useState<number>(0);

  const [cardOrchardWoods, setCardOrchardWoods] =
    useState<EventCardOrchardWoods>(() =>
      pickRandomOrchardWoods(getEventPoolOrchardWoods('medium')),
    );

  const [rolledOrchardWoods, setRolledOrchardWoods] = useState<number | null>(
    null,
  );

  const [outcomeOrchardWoods, setOutcomeOrchardWoods] = useState<
    'bad' | 'neutral' | 'good' | null
  >(null);

  const [leaveVisibleOrchardWoods, setLeaveVisibleOrchardWoods] =
    useState(false);

  const [roundEndVisibleOrchardWoods, setRoundEndVisibleOrchardWoods] =
    useState(false);

  const [rankUpVisibleOrchardWoods, setRankUpVisibleOrchardWoods] =
    useState(false);

  const [roundEndTitleOrchardWoods, setRoundEndTitleOrchardWoods] =
    useState('Well Done!');

  const [roundEndTextOrchardWoods, setRoundEndTextOrchardWoods] = useState('');

  const [roundEndCoinsOrchardWoods, setRoundEndCoinsOrchardWoods] = useState(0);

  const pendingLeaveRefOrchardWoods = useRef(false);
  const diffUIOrchardWoods = DIFF_ORCHARD_WOODS[difficultyOrchardWoods];

  const dotsOrchardWoods = useMemo(
    () => Array.from({ length: 10 }).map((_, i) => i + 1),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const loadSelectedHeroOrchardWoods = async () => {
        try {
          const rawOrchardWoods = await AsyncStorage.getItem(
            HERO_STATE_KEY_ORCHARD_WOODS,
          );
          if (!rawOrchardWoods) return;

          const parsedOrchardWoods = JSON.parse(rawOrchardWoods) as {
            selected?: HeroId;
          };

          const nextIdOrchardWoods = parsedOrchardWoods.selected;

          if (
            nextIdOrchardWoods &&
            HERO_INDEX_ORCHARD_WOODS[nextIdOrchardWoods] !== undefined
          ) {
            setSelectedHeroIdOrchardWoods(nextIdOrchardWoods);
            setLivesOrchardWoods(
              HEROES[HERO_INDEX_ORCHARD_WOODS[nextIdOrchardWoods]].lives,
            );
          } else {
            setSelectedHeroIdOrchardWoods('rowan');
            setLivesOrchardWoods(HEROES[0].lives);
          }
        } catch {}
      };

      void loadSelectedHeroOrchardWoods();
    }, []),
  );

  const canRollOrchardWoods =
    rolledOrchardWoods === null &&
    livesOrchardWoods > 0 &&
    stepOrchardWoods <= 10;

  const canNextOrchardWoods =
    rolledOrchardWoods !== null &&
    livesOrchardWoods > 0 &&
    stepOrchardWoods < 10;

  const isLastStepDoneOrchardWoods =
    rolledOrchardWoods !== null && stepOrchardWoods === 10;

  const computeHardGoodRewardTextOrchardWoods = (
    currentLivesOrchardWoods: number,
  ) => {
    if (currentLivesOrchardWoods >= heroOrchardWoods.lives) return '+5 coins';
    return '+1 life';
  };

  const startNewRunOrchardWoods = useCallback(() => {
    const dOrchardWoods = randomDifficultyOrchardWoods();
    setDifficultyOrchardWoods(dOrchardWoods);

    setStepOrchardWoods(1);
    setLivesOrchardWoods(heroOrchardWoods.lives);
    setRunCoinsOrchardWoods(0);
    setRolledOrchardWoods(null);
    setOutcomeOrchardWoods(null);

    setCardOrchardWoods(
      pickRandomOrchardWoods(getEventPoolOrchardWoods(dOrchardWoods)),
    );
  }, [heroOrchardWoods.lives]);

  useEffect(() => {
    startNewRunOrchardWoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetRunOrchardWoods = useCallback(() => {
    setRoundEndVisibleOrchardWoods(false);
    setLeaveVisibleOrchardWoods(false);
    pendingLeaveRefOrchardWoods.current = false;

    startNewRunOrchardWoods();
  }, [startNewRunOrchardWoods]);

  const applyEconomyAndResultOrchardWoods = useCallback(
    async (
      dOrchardWoods: DifficultyOrchardWoods,
      rollOrchardWoods: number,
      oOrchardWoods: 'bad' | 'neutral' | 'good',
    ) => {
      let nextLivesOrchardWoods = livesOrchardWoods;
      let coinsDeltaOrchardWoods = 0;

      if (oOrchardWoods === 'bad') {
        nextLivesOrchardWoods = Math.max(0, livesOrchardWoods - 1);
        coinsDeltaOrchardWoods = 0;
      } else {
        coinsDeltaOrchardWoods = 1;
      }

      if (oOrchardWoods === 'good') {
        if (dOrchardWoods === 'medium') coinsDeltaOrchardWoods += 3;

        if (dOrchardWoods === 'hard') {
          if (livesOrchardWoods >= heroOrchardWoods.lives) {
            coinsDeltaOrchardWoods += 5;
          } else {
            nextLivesOrchardWoods = Math.min(
              heroOrchardWoods.lives,
              nextLivesOrchardWoods + 1,
            );
          }
        }
      }

      setLivesOrchardWoods(nextLivesOrchardWoods);
      setRunCoinsOrchardWoods(prev => prev + coinsDeltaOrchardWoods);

      const finishedOrchardWoods =
        stepOrchardWoods === 10 || nextLivesOrchardWoods <= 0;

      if (finishedOrchardWoods) {
        const fixedBonusOrchardWoods = heroOrchardWoods.fixedBonusCoins;
        const isWinOrchardWoods =
          stepOrchardWoods === 10 && nextLivesOrchardWoods >= 1;

        const winBonusOrchardWoods = isWinOrchardWoods ? 5 : 0;

        let rankedUpBonusCoinsOrchardWoods = 0;

        if (isWinOrchardWoods) {
          try {
            const prevWins = await getWinsOrchardWoods();
            const prevRank = rankIndexFromWinsOrchardWoods(prevWins);

            const nextWins = await addWinOrchardWoods();
            const nextRank = rankIndexFromWinsOrchardWoods(nextWins);

            if (nextRank > prevRank) {
              rankedUpBonusCoinsOrchardWoods = 3;

              const rawCoins = await AsyncStorage.getItem(
                STORAGE_TOTAL_COINS_ORCHARD_WOODS,
              );
              const curCoins = rawCoins ? Number(JSON.parse(rawCoins)) : 0;
              const safeCoins = Number.isFinite(curCoins) ? curCoins : 0;

              await AsyncStorage.setItem(
                STORAGE_TOTAL_COINS_ORCHARD_WOODS,
                JSON.stringify(safeCoins + rankedUpBonusCoinsOrchARD_WOODS),
              );

              setRankUpVisibleOrchardWoods(true);
            }
          } catch {}
        }

        const totalAddedOrchardWoods =
          runCoinsOrchardWoods +
          coinsDeltaOrchardWoods +
          fixedBonusOrchardWoods +
          winBonusOrchardWoods +
          rankedUpBonusCoinsOrchardWoods;

        try {
          const rawOrchardWoods = await AsyncStorage.getItem(
            STORAGE_TOTAL_COINS_ORCHARD_WOODS,
          );
          const currentTotalOrchardWoods = rawOrchardWoods
            ? Number(JSON.parse(rawOrchardWoods))
            : 0;
          const safeTotalOrchardWoods = Number.isFinite(
            currentTotalOrchardWoods,
          )
            ? currentTotalOrchardWoods
            : 0;
          const nextTotalOrchardWoods =
            safeTotalOrchardWoods + totalAddedOrchardWoods;

          await AsyncStorage.setItem(
            STORAGE_TOTAL_COINS_ORCHARD_WOODS,
            JSON.stringify(nextTotalOrchardWoods),
          );
        } catch {}

        try {
          await unlockRandomPiece();
        } catch {}

        setRoundEndCoinsOrchardWoods(totalAddedOrchardWoods);

        if (nextLivesOrchardWoods <= 0) {
          setRoundEndTitleOrchardWoods('So close!');
          setRoundEndTextOrchardWoods(
            'The path was tough, but you’ll return stronger.',
          );
        } else {
          setRoundEndTitleOrchardWoods('Well Done!');
          setRoundEndTextOrchardWoods('The Berry Kingdom smiles on you today.');
        }

        setRoundEndVisibleOrchardWoods(true);
      }
    },
    [
      heroOrchardWoods.fixedBonusCoins,
      heroOrchardWoods.lives,
      livesOrchardWoods,
      runCoinsOrchardWoods,
      stepOrchardWoods,
    ],
  );

  const onPressRollOrchardWoods = useCallback(() => {
    if (!canRollOrchardWoods) return;
    isEnabledVibrationOrchardWoods && Vibration.vibrate(100);

    const rOrchardWoods = rollD10OrchardWoods();
    const oOrchardWoods = calcOutcomeOrchardWoods(
      difficultyOrchardWoods,
      rOrchardWoods,
    );

    setRolledOrchardWoods(rOrchardWoods);
    setOutcomeOrchardWoods(oOrchardWoods);

    void applyEconomyAndResultOrchardWoods(
      difficultyOrchardWoods,
      rOrchardWoods,
      oOrchardWoods,
    );
  }, [
    applyEconomyAndResultOrchardWoods,
    canRollOrchardWoods,
    difficultyOrchardWoods,
    isEnabledVibrationOrchardWoods,
  ]);

  const onNextStepOrchardWoods = useCallback(() => {
    if (!canNextOrchardWoods) return;

    setStepOrchardWoods(prev => prev + 1);
    setRolledOrchardWoods(null);
    setOutcomeOrchardWoods(null);
    setCardOrchardWoods(
      pickRandomOrchardWoods(getEventPoolOrchardWoods(difficultyOrchardWoods)),
    );
  }, [canNextOrchardWoods, difficultyOrchardWoods]);

  const confirmLeaveOrchardWoods = useCallback(() => {
    setLeaveVisibleOrchardWoods(false);
    pendingLeaveRefOrchardWoods.current = false;
    navigationOrchardWoods.goBack();
  }, [navigationOrchardWoods]);

  const askLeaveOrchardWoods = useCallback(() => {
    setLeaveVisibleOrchardWoods(true);
    pendingLeaveRefOrchardWoods.current = true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackOrchardWoods = () => {
        askLeaveOrchardWoods();
        return true;
      };
      const subOrchardWoods = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackOrchardWoods,
      );
      return () => subOrchardWoods.remove();
    }, [askLeaveOrchardWoods]),
  );

  const resultLineOrchardWoods = useMemo(() => {
    if (rolledOrchardWoods === null || !outcomeOrchardWoods) return null;

    if (difficultyOrchardWoods === 'hard' && outcomeOrchardWoods === 'good') {
      return `Rare reward: ${computeHardGoodRewardTextOrchardWoods(
        livesOrchardWoods,
      )}`;
    }
    return (cardOrchardWoods as any).outcomes[outcomeOrchardWoods];
  }, [
    cardOrchardWoods,
    difficultyOrchardWoods,
    livesOrchardWoods,
    outcomeOrchardWoods,
    rolledOrchardWoods,
  ]);

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={orchardWoodsBg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, height: 800 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={orchardWoodsTopCardWrap}>
          <ImageBackground
            source={diffUIOrchardWoods.frame}
            style={orchardWoodsTopCard}
            resizeMode="stretch"
          >
            <Text style={orchardWoodsCardTitle}>{cardOrchardWoods.title}</Text>

            <Text style={orchardWoodsCardEventText}>
              {cardOrchardWoods.event}
            </Text>

            {!!resultLineOrchardWoods && (
              <Text style={orchardWoodsCardResultText}>
                {resultLineOrchardWoods}
              </Text>
            )}

            <View style={orchardWoodsDotsRow}>
              {dotsOrchardWoods.map(nOrchardWoods => {
                const activeOrchardWoods = nOrchardWoods <= stepOrchardWoods;
                return (
                  <View
                    key={nOrchardWoods}
                    style={[
                      orchardWoodsDot,
                      activeOrchardWoods && orchardWoodsDotActive,
                    ]}
                  />
                );
              })}
            </View>
          </ImageBackground>
        </View>

        <View style={orchardWoodsCenterWrap}>
          <ImageBackground
            source={require('../../assets/images/purpleBadge.png')}
            style={orchardWoodsBadge}
            resizeMode="contain"
          >
            <Text style={orchardWoodsBadgeText}>
              {rolledOrchardWoods ?? '?'}
            </Text>
          </ImageBackground>

          <View style={orchardWoodsHeroWrap}>
            <Image
              source={heroOrchardWoods.image}
              style={orchardWoodsHeroImg}
              resizeMode="contain"
            />

            <ImageBackground
              source={require('../../assets/images/heart.png')}
              style={orchardWoodsLivesBubble}
            >
              <Text style={orchardWoodsLivesText}>{livesOrchardWoods}</Text>
            </ImageBackground>
          </View>
        </View>

        <View style={orchardWoodsBottomButtonsArea}>
          {canRollOrchardWoods ? (
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPressRollOrchardWoods}
              >
                <ImageBackground
                  source={require('../../assets/images/introBtn.png')}
                  style={orchardWoodsMainBtn}
                  resizeMode="stretch"
                >
                  <Text style={orchardWoodsMainBtnText}>Start</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={askLeaveOrchardWoods}
              >
                <ImageBackground
                  source={require('../../assets/images/homebtn.png')}
                  style={[
                    orchardWoodsHomeBtn,
                    { marginTop: 12, alignSelf: 'center' },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={orchardWoodsAfterRollRow}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onNextStepOrchardWoods}
                disabled={!canNextOrchardWoods}
              >
                <ImageBackground
                  source={require('../../assets/images/introBtn.png')}
                  style={[
                    orchardWoodsMainBtn,
                    !canNextOrchardWoods && { opacity: 0.55 },
                  ]}
                  resizeMode="stretch"
                >
                  <Text style={orchardWoodsMainBtnText}>
                    {isLastStepDoneOrchardWoods ? 'Finish' : 'Next'}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <View style={{ height: 12 }} />

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={askLeaveOrchardWoods}
              >
                <ImageBackground
                  source={require('../../assets/images/homebtn.png')}
                  style={orchardWoodsHomeBtn}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Leave modal */}
        <Modal
          visible={leaveVisibleOrchardWoods}
          transparent
          animationType="fade"
          onRequestClose={() => setLeaveVisibleOrchardWoods(false)}
        >
          <View style={orchardWoodsModalBackdrop}>
            <ImageBackground
              source={require('../../assets/images/resetModal.png')}
              style={orchardWoodsLeaveModal}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsLeaveTitle}>Leave the Game?</Text>

              <View style={orchardWoodsLeaveBtnsRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setLeaveVisibleOrchardWoods(false);
                    pendingLeaveRefOrchardWoods.current = false;
                  }}
                >
                  <Image
                    source={require('../../assets/images/homeNobtn.png')}
                    style={orchardWoodsLeaveIconBtn}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={confirmLeaveOrchardWoods}
                >
                  <Image
                    source={require('../../assets/images/homeYesbtn.png')}
                    style={orchardWoodsLeaveIconBtn}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>

        {/* Rank up modal */}
        <Modal
          visible={rankUpVisibleOrchardWoods}
          transparent
          animationType="fade"
          onRequestClose={() => setRankUpVisibleOrchardWoods(false)}
        >
          <View style={orchardWoodsModalBackdrop}>
            <ImageBackground
              source={require('../../assets/images/winmodal.png')}
              style={orchardWoodsRankUpModal}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsResultTitle}>Rank Up!</Text>
              <Text style={orchardWoodsResultBody}>
                You earned a crown bonus.
              </Text>

              <View style={orchardWoodsResultCoinsRow}>
                <Image source={require('../../assets/images/coin.png')} />
                <Text style={orchardWoodsResultCoinsText}>{`x ${3}`}</Text>
              </View>

              <View style={{ height: 16 }} />

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setRankUpVisibleOrchardWoods(false)}
              >
                <ImageBackground
                  source={require('../../assets/images/introBtn.png')}
                  style={orchardWoodsMainBtn}
                  resizeMode="stretch"
                >
                  <Text style={orchardWoodsMainBtnText}>OK</Text>
                </ImageBackground>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>

        {/* Round end modal */}
        <Modal
          visible={roundEndVisibleOrchardWoods}
          transparent
          animationType="fade"
          onRequestClose={() => setRoundEndVisibleOrchardWoods(false)}
        >
          <View style={orchardWoodsModalBackdrop}>
            <ImageBackground
              source={
                livesOrchardWoods <= 0
                  ? require('../../assets/images/losemodal.png')
                  : require('../../assets/images/winmodal.png')
              }
              style={orchardWoodsResultModal}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsResultTitle}>
                {roundEndTitleOrchardWoods}
              </Text>
              <Text style={orchardWoodsResultBody}>
                {roundEndTextOrchardWoods}
              </Text>

              <View style={orchardWoodsResultCoinsRow}>
                <Image source={require('../../assets/images/coin.png')} />
                {livesOrchardWoods <= 0 ? (
                  <Text style={orchardWoodsResultCoinsText}>{`x ${2}`}</Text>
                ) : (
                  <Text style={orchardWoodsResultCoinsText}>
                    {`x ${roundEndCoinsOrchardWoods}`}
                  </Text>
                )}
              </View>

              {livesOrchardWoods > 0 && (
                <View style={orchardWoodsResultCoinsRow}>
                  <Image source={require('../../assets/images/artifact.png')} />
                  <Text style={orchardWoodsResultCoinsText}>{`x ${1}`}</Text>
                </View>
              )}
            </ImageBackground>

            <View style={{ height: 14 }} />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={resetRunOrchardWoods}
            >
              <ImageBackground
                source={require('../../assets/images/introBtn.png')}
                style={orchardWoodsMainBtn}
                resizeMode="stretch"
              >
                <Text style={orchardWoodsMainBtnText}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>

            <View style={{ height: 10 }} />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigationOrchardWoods.goBack()}
            >
              <ImageBackground
                source={require('../../assets/images/homebtn.png')}
                style={orchardWoodsHomeBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const orchardWoodsBg = { flex: 1 };

const orchardWoodsTopCardWrap = {
  position: 'absolute' as const,
  top: 54,
  alignSelf: 'center' as const,
  zIndex: 10,
};

const orchardWoodsTopCard = {
  width: 263,
  height: 250,
  paddingTop: 25,
  paddingHorizontal: 22,
  alignItems: 'center' as const,
};

const orchardWoodsCardTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 20,
  textAlign: 'center' as const,
  marginBottom: 10,
};

const orchardWoodsCardEventText = {
  color: '#FFFFFF',
  fontSize: 16,
  textAlign: 'center' as const,
  paddingHorizontal: 8,
  marginTop: 20,
};

const orchardWoodsCardResultText = {
  color: '#FFFFFF',
  fontSize: 16,
  textAlign: 'center' as const,
  marginTop: 10,
};

const orchardWoodsDotsRow = {
  position: 'absolute' as const,
  bottom: 23,
  flexDirection: 'row' as const,
  gap: 6,
};

const orchardWoodsDot = {
  width: 10,
  height: 10,
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
};

const orchardWoodsDotActive = {
  backgroundColor: '#FED546',
};

const orchardWoodsCenterWrap = {
  flex: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingTop: 140,
};

const orchardWoodsBadge = {
  width: 105,
  height: 76,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: 15,
};

const orchardWoodsBadgeText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
};

const orchardWoodsHeroWrap = {
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsHeroImg = {
  width: 220,
  height: 260,
};

const orchardWoodsLivesBubble = {
  position: 'absolute' as const,
  right: 40,
  top: 0,
  width: 28,
  height: 24,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsLivesText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 15,
};

const orchardWoodsBottomButtonsArea = {
  position: 'absolute' as const,
  bottom: 46,
  width: '100%' as const,
  alignItems: 'center' as const,
};

const orchardWoodsMainBtn = {
  width: 180,
  height: 56,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsMainBtnText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 18,
};

const orchardWoodsAfterRollRow = {
  alignItems: 'center' as const,
};

const orchardWoodsHomeBtn = {
  width: 54,
  height: 54,
};

const orchardWoodsModalBackdrop = {
  flex: 1,
  backgroundColor: '#153b7753',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 18,
};

const orchardWoodsLeaveModal = {
  width: 340,
  height: 160,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingTop: 10,
};

const orchardWoodsLeaveTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
  marginBottom: 18,
};

const orchardWoodsLeaveBtnsRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  width: '60%' as const,
  top: 70,
};

const orchardWoodsLeaveIconBtn = {
  width: 54,
  height: 54,
};

const orchardWoodsResultModal = {
  width: 307,
  height: 297,
  alignItems: 'center' as const,
  paddingHorizontal: 22,
  paddingTop: 35,
};

const orchardWoodsRankUpModal = {
  width: 307,
  height: 260,
  alignItems: 'center' as const,
  paddingHorizontal: 22,
  paddingTop: 35,
};

const orchardWoodsResultTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
  marginBottom: 50,
  textAlign: 'center' as const,
};

const orchardWoodsResultBody = {
  color: '#FFFFFF',
  fontSize: 16,
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
  paddingHorizontal: 18,
};

const orchardWoodsResultCoinsRow = {
  marginTop: 14,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 8,
};

const orchardWoodsResultCoinsText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 20,
};
