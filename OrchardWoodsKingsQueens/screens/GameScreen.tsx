import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated as RNAnimated,
  BackHandler,
  Easing,
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

const DICE_UNKNOWN_ORCHARD_WOODS = require('../../assets/images/cubquest.png');
const DICE_FACE_ASSETS_ORCHARD_WOODS: Record<1 | 2 | 3 | 4 | 5 | 6, any> = {
  1: require('../../assets/images/cub1.png'),
  2: require('../../assets/images/cub2.png'),
  3: require('../../assets/images/cub3.png'),
  4: require('../../assets/images/cub4.png'),
  5: require('../../assets/images/cub5.png'),
  6: require('../../assets/images/cub6.png'),
};

const SCALE_BAR_EASY_ORCHARD_WOODS = require('../../assets/images/bar1.png');
const SCALE_BAR_MEDIUM_ORCHARD_WOODS = require('../../assets/images/bar2.png');
const SCALE_BAR_HARD_ORCHARD_WOODS = require('../../assets/images/bar3.png');

const SCALE_RUNNER_MARKER_ORCHARD_WOODS = require('../../assets/images/runner.png');

const MODE_SAFE_BUTTON_ORCHARD_WOODS = require('../../assets/images/introBtn.png');
const MODE_RISK_BUTTON_ORCHARD_WOODS = require('../../assets/images/safe.png');

function pickRandomOrchardWoods<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rollD6OrchardWoods() {
  return Math.floor(Math.random() * 6) + 1;
}

const ORCHARD_WOODS_SCALE_BAR_WIDTH = 300;

function getScaleLayoutOrchardWoods(dice: number): {
  green: number;
  yellow: number;
  red: number;
} {
  if (dice <= 2) return { green: 38, yellow: 36, red: 26 };
  if (dice <= 4) return { green: 33, yellow: 34, red: 33 };
  return { green: 26, yellow: 36, red: 38 };
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

  type GamePhaseOrchardWoods =
    | 'intro'
    | 'dice_rolling'
    | 'dice_shown'
    | 'mode_select'
    | 'runner'
    | 'result';
  const [gamePhaseOrchardWoods, setGamePhaseOrchardWoods] =
    useState<GamePhaseOrchardWoods>('intro');

  const [showHowRoundWorksOrchardWoods, setShowHowRoundWorksOrchardWoods] =
    useState(true);

  const [scaleModeOrchardWoods, setScaleModeOrchardWoods] = useState<
    'safe' | 'risk' | null
  >(null);

  const diceAnimOrchardWoods = useRef(new RNAnimated.Value(0)).current;
  const diceAnimLoopRefOrchardWoods =
    useRef<RNAnimated.CompositeAnimation | null>(null);
  const diceRevealTimerRefOrchardWoods = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const diceToModeTimerRefOrchardWoods = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const runnerAnimOrchardWoods = useRef(new RNAnimated.Value(0)).current;
  const runnerPositionRefOrchardWoods = useRef(0);
  const runnerDirectionRefOrchardWoods = useRef<1 | -1>(1);
  const runnerStoppedAtOrchardWoods = useRef<number | null>(null);
  const runnerIntervalOrchardWoods = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const RUNNER_TICK_MS = 40;
  const RUNNER_SAFE_STEP_ORCHARD_WOODS = 6.2;
  const RUNNER_RISK_STEP_ORCHARD_WOODS = 13.9;

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

  const canPressStartOrchardWoods =
    gamePhaseOrchardWoods === 'intro' &&
    livesOrchardWoods > 0 &&
    stepOrchardWoods <= 10;

  const canNextOrchardWoods =
    gamePhaseOrchardWoods === 'result' &&
    livesOrchardWoods > 0 &&
    stepOrchardWoods <= 10;

  const isLastStepDoneOrchardWoods =
    gamePhaseOrchardWoods === 'result' && stepOrchardWoods === 10;

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
    setGamePhaseOrchardWoods('intro');
    setShowHowRoundWorksOrchardWoods(true);
    setScaleModeOrchardWoods(null);
    runnerAnimOrchardWoods.setValue(0);
    runnerStoppedAtOrchardWoods.current = null;
    if (runnerIntervalOrchardWoods.current) {
      clearInterval(runnerIntervalOrchardWoods.current);
      runnerIntervalOrchardWoods.current = null;
    }
    if (diceRevealTimerRefOrchardWoods.current) {
      clearTimeout(diceRevealTimerRefOrchardWoods.current);
      diceRevealTimerRefOrchardWoods.current = null;
    }
    if (diceToModeTimerRefOrchardWoods.current) {
      clearTimeout(diceToModeTimerRefOrchardWoods.current);
      diceToModeTimerRefOrchardWoods.current = null;
    }
    if (diceAnimLoopRefOrchardWoods.current) {
      diceAnimLoopRefOrchardWoods.current.stop();
      diceAnimLoopRefOrchardWoods.current = null;
    }
    diceAnimOrchardWoods.setValue(0);

    setCardOrchardWoods(
      pickRandomOrchardWoods(getEventPoolOrchardWoods(dOrchardWoods)),
    );
  }, [heroOrchardWoods.lives, runnerAnimOrchardWoods, diceAnimOrchardWoods]);

  useEffect(() => {
    startNewRunOrchardWoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (runnerIntervalOrchardWoods.current) {
        clearInterval(runnerIntervalOrchardWoods.current);
        runnerIntervalOrchardWoods.current = null;
      }
      if (diceRevealTimerRefOrchardWoods.current) {
        clearTimeout(diceRevealTimerRefOrchardWoods.current);
        diceRevealTimerRefOrchardWoods.current = null;
      }
      if (diceToModeTimerRefOrchardWoods.current) {
        clearTimeout(diceToModeTimerRefOrchardWoods.current);
        diceToModeTimerRefOrchardWoods.current = null;
      }
      if (diceAnimLoopRefOrchardWoods.current) {
        diceAnimLoopRefOrchardWoods.current.stop();
        diceAnimLoopRefOrchardWoods.current = null;
      }
      diceAnimOrchardWoods.setValue(0);
    };
  }, [diceAnimOrchardWoods]);

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
      riskModeMultiplierOrchardWoods?: number,
    ) => {
      let nextLivesOrchardWoods = livesOrchardWoods;
      let coinsDeltaOrchardWoods = 0;

      if (oOrchardWoods === 'bad') {
        nextLivesOrchardWoods = Math.max(0, livesOrchardWoods - 1);
        coinsDeltaOrchardWoods = 0;
      } else if (oOrchardWoods === 'neutral') {
        coinsDeltaOrchardWoods = 0;
      } else {
        // good: scale reward — Safe = 1, Risk = 2
        coinsDeltaOrchardWoods = riskModeMultiplierOrchardWoods === 2 ? 2 : 1;
      }

      if (
        oOrchardWoods === 'good' &&
        riskModeMultiplierOrchardWoods === undefined
      ) {
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
                JSON.stringify(safeCoins + rankedUpBonusCoinsOrchardWoods),
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

  const stopDiceAnimationOrchardWoods = useCallback(() => {
    if (diceAnimLoopRefOrchardWoods.current) {
      diceAnimLoopRefOrchardWoods.current.stop();
      diceAnimLoopRefOrchardWoods.current = null;
    }
    diceAnimOrchardWoods.setValue(0);
  }, [diceAnimOrchardWoods]);

  const startDiceAnimationOrchardWoods = useCallback(() => {
    stopDiceAnimationOrchardWoods();
    const loop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(diceAnimOrchardWoods, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(diceAnimOrchardWoods, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    diceAnimLoopRefOrchardWoods.current = loop;
    loop.start();
  }, [diceAnimOrchardWoods, stopDiceAnimationOrchardWoods]);

  const onPressStartOrchardWoods = useCallback(() => {
    if (!canPressStartOrchardWoods) return;
    isEnabledVibrationOrchardWoods && Vibration.vibrate(100);
    setGamePhaseOrchardWoods('dice_rolling');
    setRolledOrchardWoods(null);
    startDiceAnimationOrchardWoods();

    if (diceRevealTimerRefOrchardWoods.current) {
      clearTimeout(diceRevealTimerRefOrchardWoods.current);
      diceRevealTimerRefOrchardWoods.current = null;
    }
    if (diceToModeTimerRefOrchardWoods.current) {
      clearTimeout(diceToModeTimerRefOrchardWoods.current);
      diceToModeTimerRefOrchardWoods.current = null;
    }

    const diceOrchardWoods = rollD6OrchardWoods();
    diceRevealTimerRefOrchardWoods.current = setTimeout(() => {
      stopDiceAnimationOrchardWoods();
      setRolledOrchardWoods(diceOrchardWoods);
      setGamePhaseOrchardWoods('dice_shown');
      diceToModeTimerRefOrchardWoods.current = setTimeout(() => {
        runnerPositionRefOrchardWoods.current = 50;
        runnerDirectionRefOrchardWoods.current = 1;
        runnerAnimOrchardWoods.setValue(50);
        setGamePhaseOrchardWoods('mode_select');
      }, 800);
    }, 1200);
  }, [
    canPressStartOrchardWoods,
    isEnabledVibrationOrchardWoods,
    runnerAnimOrchardWoods,
    startDiceAnimationOrchardWoods,
    stopDiceAnimationOrchardWoods,
  ]);

  const startRunnerOrchardWoods = useCallback(
    (isRiskOrchardWoods: boolean) => {
      setScaleModeOrchardWoods(isRiskOrchardWoods ? 'risk' : 'safe');
      setGamePhaseOrchardWoods('runner');
      runnerDirectionRefOrchardWoods.current = 1;
      runnerStoppedAtOrchardWoods.current = null;
      if (runnerIntervalOrchardWoods.current) {
        clearInterval(runnerIntervalOrchardWoods.current);
        runnerIntervalOrchardWoods.current = null;
      }

      const stepSizeOrchardWoods = isRiskOrchardWoods
        ? RUNNER_RISK_STEP_ORCHARD_WOODS
        : RUNNER_SAFE_STEP_ORCHARD_WOODS;
      runnerIntervalOrchardWoods.current = setInterval(() => {
        if (runnerStoppedAtOrchardWoods.current !== null) return;
        let nextPosOrchardWoods =
          runnerPositionRefOrchardWoods.current +
          stepSizeOrchardWoods * runnerDirectionRefOrchardWoods.current;

        if (nextPosOrchardWoods >= 100) {
          nextPosOrchardWoods = 100;
          runnerDirectionRefOrchardWoods.current = -1;
        } else if (nextPosOrchardWoods <= 0) {
          nextPosOrchardWoods = 0;
          runnerDirectionRefOrchardWoods.current = 1;
        }

        runnerPositionRefOrchardWoods.current = nextPosOrchardWoods;
        runnerAnimOrchardWoods.setValue(nextPosOrchardWoods);
      }, RUNNER_TICK_MS);
    },
    [runnerAnimOrchardWoods],
  );

  const onStopRunnerOrchardWoods = useCallback(() => {
    if (
      gamePhaseOrchardWoods !== 'runner' ||
      runnerStoppedAtOrchardWoods.current !== null
    )
      return;
    isEnabledVibrationOrchardWoods && Vibration.vibrate(50);

    const stopAt = Math.min(
      100,
      Math.max(0, runnerPositionRefOrchardWoods.current),
    );
    runnerStoppedAtOrchardWoods.current = stopAt;

    if (runnerIntervalOrchardWoods.current) {
      clearInterval(runnerIntervalOrchardWoods.current);
      runnerIntervalOrchardWoods.current = null;
    }
    runnerAnimOrchardWoods.setValue(stopAt);

    const diceOrchardWoods = rolledOrchardWoods ?? 1;
    const layoutOrchardWoods = getScaleLayoutOrchardWoods(diceOrchardWoods);
    const g = layoutOrchardWoods.green;
    const y = layoutOrchardWoods.yellow;
    const zoneOrchardWoods: 'good' | 'neutral' | 'bad' =
      stopAt <= g ? 'good' : stopAt <= g + y ? 'neutral' : 'bad';
    setOutcomeOrchardWoods(zoneOrchardWoods);

    const isRiskOrchardWoods = scaleModeOrchardWoods === 'risk';
    const multOrchardWoods = isRiskOrchardWoods ? 2 : 1;
    void applyEconomyAndResultOrchardWoods(
      difficultyOrchardWoods,
      diceOrchardWoods,
      zoneOrchardWoods,
      multOrchardWoods,
    );
    setGamePhaseOrchardWoods('result');
  }, [
    gamePhaseOrchardWoods,
    rolledOrchardWoods,
    scaleModeOrchardWoods,
    difficultyOrchardWoods,
    runnerAnimOrchardWoods,
    applyEconomyAndResultOrchardWoods,
    isEnabledVibrationOrchardWoods,
  ]);

  const onNextStepOrchardWoods = useCallback(() => {
    if (!canNextOrchardWoods) return;

    setStepOrchardWoods(prev => prev + 1);
    setRolledOrchardWoods(null);
    setOutcomeOrchardWoods(null);
    setGamePhaseOrchardWoods('intro');
    setScaleModeOrchardWoods(null);
    setShowHowRoundWorksOrchardWoods(false);
    runnerAnimOrchardWoods.setValue(0);
    runnerStoppedAtOrchardWoods.current = null;
    stopDiceAnimationOrchardWoods();
    if (diceRevealTimerRefOrchardWoods.current) {
      clearTimeout(diceRevealTimerRefOrchardWoods.current);
      diceRevealTimerRefOrchardWoods.current = null;
    }
    if (diceToModeTimerRefOrchardWoods.current) {
      clearTimeout(diceToModeTimerRefOrchardWoods.current);
      diceToModeTimerRefOrchardWoods.current = null;
    }
    setCardOrchardWoods(
      pickRandomOrchardWoods(getEventPoolOrchardWoods(difficultyOrchardWoods)),
    );
  }, [
    canNextOrchardWoods,
    difficultyOrchardWoods,
    runnerAnimOrchardWoods,
    stopDiceAnimationOrchardWoods,
  ]);

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
    if (
      gamePhaseOrchardWoods !== 'result' ||
      rolledOrchardWoods === null ||
      !outcomeOrchardWoods
    )
      return null;

    if (difficultyOrchardWoods === 'hard' && outcomeOrchardWoods === 'good') {
      return `Rare reward: ${computeHardGoodRewardTextOrchardWoods(
        livesOrchardWoods,
      )}`;
    }
    return (cardOrchardWoods as any).outcomes[outcomeOrchardWoods];
  }, [
    cardOrchardWoods,
    difficultyOrchardWoods,
    gamePhaseOrchardWoods,
    livesOrchardWoods,
    outcomeOrchardWoods,
    rolledOrchardWoods,
  ]);

  const scaleLayoutOrchardWoods = useMemo(() => {
    const d = rolledOrchardWoods ?? 1;
    return getScaleLayoutOrchardWoods(d);
  }, [rolledOrchardWoods]);

  const scaleFrameSourceOrchardWoods = useMemo(() => {
    const d = rolledOrchardWoods ?? 1;
    if (d <= 2) return SCALE_BAR_EASY_ORCHARD_WOODS;
    if (d <= 4) return SCALE_BAR_MEDIUM_ORCHARD_WOODS;
    return SCALE_BAR_HARD_ORCHARD_WOODS;
  }, [rolledOrchardWoods]);

  const showScaleOrchardWoods =
    gamePhaseOrchardWoods === 'mode_select' ||
    gamePhaseOrchardWoods === 'runner' ||
    gamePhaseOrchardWoods === 'result';

  const isIntroScreenOrchardWoods =
    showHowRoundWorksOrchardWoods &&
    gamePhaseOrchardWoods === 'intro' &&
    stepOrchardWoods === 1;

  const diceFaceSourceOrchardWoods =
    rolledOrchardWoods && rolledOrchardWoods >= 1 && rolledOrchardWoods <= 6
      ? DICE_FACE_ASSETS_ORCHARD_WOODS[
          rolledOrchardWoods as 1 | 2 | 3 | 4 | 5 | 6
        ]
      : DICE_UNKNOWN_ORCHARD_WOODS;

  const diceJumpYOrchardWoods = diceAnimOrchardWoods.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });
  const diceStretchXOrchardWoods = diceAnimOrchardWoods.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const diceStretchYOrchardWoods = diceAnimOrchardWoods.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

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
        {isIntroScreenOrchardWoods ? (
          <View style={orchardWoodsIntroOverlay}>
            <Image
              source={require('../../assets/images/introimg1.png')}
              style={orchardWoodsIntroLogo}
              resizeMode="contain"
            />
            <ImageBackground
              source={require('../../assets/images/largeBoard.png')}
              style={[orchardWoodsHowRoundModal, { marginBottom: 30 }]}
              resizeMode="stretch"
            >
              <Text
                style={[
                  orchardWoodsHowRoundTitle,
                  { marginTop: 10, marginBottom: 40 },
                ]}
              >
                How the Round Works
              </Text>
              <Text style={orchardWoodsHowRoundText}>
                Roll the dice and watch the bar.
              </Text>
              <Text style={orchardWoodsHowRoundText}>
                Green is a good outcome, yellow is safe, red is danger.
              </Text>
              <Text style={orchardWoodsHowRoundText}>Choose your mode:</Text>
              <Text style={orchardWoodsHowRoundText}>
                Safe — slower, safer.
              </Text>
              <Text style={orchardWoodsHowRoundText}>
                Risk — faster, double reward.
              </Text>
              <Text style={orchardWoodsHowRoundText}>
                Stop the marker at the right moment.
              </Text>
            </ImageBackground>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowHowRoundWorksOrchardWoods(false)}
            >
              <ImageBackground
                source={require('../../assets/images/introBtn.png')}
                style={orchardWoodsMainBtn}
                resizeMode="stretch"
              >
                <Text style={orchardWoodsMainBtnText}>Begin</Text>
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
        ) : (
          <>
            <View style={orchardWoodsTopCardWrap}>
              <ImageBackground
                source={diffUIOrchardWoods.frame}
                style={orchardWoodsTopCard}
                resizeMode="stretch"
              >
                <Text style={orchardWoodsCardTitle}>
                  {cardOrchardWoods.title}
                </Text>

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
                    const activeOrchardWoods =
                      nOrchardWoods <= stepOrchardWoods;
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
              <RNAnimated.View
                style={{
                  transform: [
                    { translateY: diceJumpYOrchardWoods },
                    { scaleX: diceStretchXOrchardWoods },
                    { scaleY: diceStretchYOrchardWoods },
                  ],
                }}
              >
                <ImageBackground
                  source={diceFaceSourceOrchardWoods}
                  style={orchardWoodsBadge}
                  resizeMode="contain"
                >
                  {(gamePhaseOrchardWoods === 'dice_rolling' ||
                    rolledOrchardWoods === null) && (
                    <Text style={orchardWoodsBadgeText}>?</Text>
                  )}
                </ImageBackground>
              </RNAnimated.View>

              {showScaleOrchardWoods && (
                <View style={orchardWoodsScaleWrap}>
                  <ImageBackground
                    source={scaleFrameSourceOrchardWoods}
                    style={orchardWoodsScaleFrame}
                    resizeMode="stretch"
                  >
                    <RNAnimated.View
                      style={[
                        orchardWoodsScaleRunner,
                        {
                          transform: [
                            {
                              translateX: runnerAnimOrchardWoods.interpolate({
                                inputRange: [0, 100],
                                outputRange: [
                                  0,
                                  ORCHARD_WOODS_SCALE_BAR_WIDTH - 34,
                                ],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Image
                        source={SCALE_RUNNER_MARKER_ORCHARD_WOODS}
                        style={orchardWoodsScaleRunnerImg}
                        resizeMode="contain"
                      />
                    </RNAnimated.View>
                  </ImageBackground>
                </View>
              )}

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

            <View style={[orchardWoodsBottomButtonsArea]}>
              {gamePhaseOrchardWoods === 'intro' &&
                canPressStartOrchardWoods && (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onPressStartOrchardWoods}
                    >
                      <ImageBackground
                        source={require('../../assets/images/introBtn.png')}
                        style={[orchardWoodsMainBtn]}
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
                )}

              {gamePhaseOrchardWoods === 'mode_select' && (
                <>
                  <View style={orchardWoodsModeSelectRow}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => startRunnerOrchardWoods(false)}
                    >
                      <ImageBackground
                        source={MODE_SAFE_BUTTON_ORCHARD_WOODS}
                        style={[orchardWoodsModeBtn]}
                        resizeMode="stretch"
                      >
                        <Text style={orchardWoodsMainBtnText}>Safe Mode</Text>
                      </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => startRunnerOrchardWoods(true)}
                    >
                      <ImageBackground
                        source={MODE_RISK_BUTTON_ORCHARD_WOODS}
                        style={[orchardWoodsModeBtn]}
                        resizeMode="stretch"
                      >
                        <Text
                          style={[orchardWoodsMainBtnText, { fontSize: 14 }]}
                        >
                          Risk Mode{'\n'}Reward X2
                        </Text>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={askLeaveOrchardWoods}
                    style={{ marginTop: 12 }}
                  >
                    <ImageBackground
                      source={require('../../assets/images/homebtn.png')}
                      style={orchardWoodsHomeBtn}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              )}

              {(gamePhaseOrchardWoods === 'dice_rolling' ||
                gamePhaseOrchardWoods === 'dice_shown') && (
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
              )}

              {gamePhaseOrchardWoods === 'runner' && (
                <View style={orchardWoodsAfterRollRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onStopRunnerOrchardWoods}
                  >
                    <ImageBackground
                      source={require('../../assets/images/safe.png')}
                      style={orchardWoodsMainBtn}
                      resizeMode="stretch"
                    >
                      <Text style={orchardWoodsMainBtnText}>LOCK</Text>
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

              {gamePhaseOrchardWoods === 'result' && (
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
          </>
        )}

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
  top: 34,
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
  bottom: 33,
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
  paddingTop: 150,
};

const orchardWoodsBadge = {
  width: 60,
  height: 58,
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
  width: 133,
  height: 240,
};

const orchardWoodsLivesBubble = {
  position: 'absolute' as const,
  right: 10,
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

const orchardWoodsHowRoundModal = {
  width: 320,
  paddingHorizontal: 24,
  paddingTop: 28,
  paddingBottom: 20,
  alignItems: 'center' as const,
  marginBottom: 16,
  height: 320,
};

const orchardWoodsIntroOverlay = {
  flex: 1,
  width: '100%' as const,
  alignItems: 'center' as const,
  justifyContent: 'flex-start' as const,
  paddingTop: 70,
};

const orchardWoodsIntroLogo = {
  width: 226,
  height: 230,
  marginBottom: 22,
};

const orchardWoodsHowRoundTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 20,
  marginBottom: 14,
  textAlign: 'center' as const,
};

const orchardWoodsHowRoundText = {
  color: '#FFFFFF',
  fontSize: 14,
  textAlign: 'center' as const,
  marginBottom: 6,
};

const orchardWoodsScaleWrap = {
  width: ORCHARD_WOODS_SCALE_BAR_WIDTH,
  marginBottom: 15,
  alignItems: 'center' as const,
};

const orchardWoodsScaleFrame = {
  width: ORCHARD_WOODS_SCALE_BAR_WIDTH,
  height: 36,
  justifyContent: 'center' as const,
};

const orchardWoodsScaleTrack = {
  height: 16,
  marginHorizontal: 12,
  borderRadius: 10,
  overflow: 'hidden' as const,
  flexDirection: 'row' as const,
};

const orchardWoodsScaleSegment = {
  height: '100%' as const,
};

const orchardWoodsScaleRunner = {
  position: 'absolute' as const,
  left: 7,
  top: 6,
  width: 20,
  height: 20,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsScaleRunnerImg = {
  width: 20,
  height: 20,
};

const orchardWoodsTapHint = {
  color: '#FED546',
  fontSize: 14,
  marginTop: 6,
};

const orchardWoodsModeSelectRow = {
  flexDirection: 'row' as const,
  gap: 14,
  alignItems: 'center' as const,
};

const orchardWoodsModeBtn = {
  width: 140,
  height: 56,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
