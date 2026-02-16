import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
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
import Toast from 'react-native-toast-message';

import { HEROES, type Hero, type HeroId } from '../data/heroes';
import { useStore } from '../store/context';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  HeroesScreen: undefined;
  Game: { level: number };
};

const COINS_KEY_ORCHARD_WOODS = 'BK_COINS_V1';
const HERO_STATE_KEY_ORCHARD_WOODS = 'BK_HERO_STATE_V1';

type HeroStateOrchardWoods = {
  owned: Record<HeroId, boolean>;
  selected: HeroId;
};

const defaultHeroStateOrchardWoods: HeroStateOrchardWoods = {
  owned: { rowan: true, elowen: false, bramble: false, nylara: false },
  selected: 'rowan',
};

export default function HeroesScreen() {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const [coinsOrchardWoods, setCoinsOrchardWoods] = useState<number>(0);
  const [indexOrchardWoods, setIndexOrchardWoods] = useState<number>(0);
  const [heroStateOrchardWoods, setHeroStateOrchardWoods] =
    useState<HeroStateOrchardWoods>(defaultHeroStateOrchardWoods);

  const { isEnabledVibration: isEnabledVibrationOrchardWoods } = useStore(); // to re-render on store changes

  const heroOrchardWoods: Hero = useMemo(
    () => HEROES[indexOrchardWoods],
    [indexOrchardWoods],
  );

  const ownedOrchardWoods = !!heroStateOrchardWoods.owned[heroOrchardWoods.id];
  const isUsingOrchardWoods =
    heroStateOrchardWoods.selected === heroOrchardWoods.id;
  const canBuyOrchardWoods = coinsOrchardWoods >= heroOrchardWoods.price;

  const loadOrchardWoods = useCallback(async () => {
    try {
      const rawCoinsOrchardWoods = await AsyncStorage.getItem(
        COINS_KEY_ORCHARD_WOODS,
      );
      setCoinsOrchardWoods(
        rawCoinsOrchardWoods
          ? Number(JSON.parse(rawCoinsOrchardWoods)) || 0
          : 0,
      );
    } catch {}

    try {
      const rawOrchardWoods = await AsyncStorage.getItem(
        HERO_STATE_KEY_ORCHARD_WOODS,
      );
      if (!rawOrchardWoods) {
        setHeroStateOrchardWoods(defaultHeroStateOrchardWoods);
        return;
      }

      const parsedOrchardWoods = JSON.parse(
        rawOrchardWoods,
      ) as Partial<HeroStateOrchardWoods>;

      setHeroStateOrchardWoods({
        owned: {
          ...defaultHeroStateOrchardWoods.owned,
          ...(parsedOrchardWoods.owned || {}),
        } as any,
        selected:
          (parsedOrchardWoods.selected as HeroId) ||
          defaultHeroStateOrchardWoods.selected,
      });
    } catch {
      setHeroStateOrchardWoods(defaultHeroStateOrchardWoods);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrchardWoods();
    }, [loadOrchardWoods]),
  );

  useEffect(() => {
    loadOrchardWoods();
  }, [loadOrchardWoods]);

  const persistOrchardWoods = async (nextOrchardWoods: {
    coins?: number;
    heroState?: HeroStateOrchardWoods;
  }) => {
    const opsOrchardWoods: Promise<any>[] = [];

    if (typeof nextOrchardWoods.coins === 'number') {
      opsOrchardWoods.push(
        AsyncStorage.setItem(
          COINS_KEY_ORCHARD_WOODS,
          JSON.stringify(nextOrchardWoods.coins),
        ),
      );
    }

    if (nextOrchardWoods.heroState) {
      opsOrchardWoods.push(
        AsyncStorage.setItem(
          HERO_STATE_KEY_ORCHARD_WOODS,
          JSON.stringify(nextOrchardWoods.heroState),
        ),
      );
    }

    try {
      await Promise.all(opsOrchardWoods);
    } catch {}
  };

  const goPrevOrchardWoods = () => {
    setIndexOrchardWoods(i => (i - 1 + HEROES.length) % HEROES.length);
  };

  const goNextOrchardWoods = () => {
    setIndexOrchardWoods(i => (i + 1) % HEROES.length);
  };

  const setUsingOrchardWoods = async (idOrchardWoods: HeroId) => {
    const nextStateOrchardWoods: HeroStateOrchardWoods = {
      ...heroStateOrchardWoods,
      selected: idOrchardWoods,
    };

    setHeroStateOrchardWoods(nextStateOrchardWoods);
    await persistOrchardWoods({ heroState: nextStateOrchardWoods });
  };

  const buyHeroOrchardWoods = async () => {
    if (heroOrchardWoods.price <= 0) {
      return setUsingOrchardWoods(heroOrchardWoods.id);
    }

    if (!canBuyOrchardWoods) {
      isEnabledVibrationOrchardWoods && Vibration.vibrate(200);
      return;
    }

    const nextCoinsOrchardWoods = coinsOrchardWoods - heroOrchardWoods.price;
    const nextStateOrchardWoods: HeroStateOrchardWoods = {
      owned: { ...heroStateOrchardWoods.owned, [heroOrchardWoods.id]: true },
      selected: heroOrchardWoods.id,
    };

    setCoinsOrchardWoods(nextCoinsOrchardWoods);
    setHeroStateOrchardWoods(nextStateOrchardWoods);

    await persistOrchardWoods({
      coins: nextCoinsOrchardWoods,
      heroState: nextStateOrchardWoods,
    });

    Toast.show({
      type: 'success',
      text1: `Purchased ${heroOrchardWoods.name}!`,
      position: 'top',
      visibilityTime: 1500,
    });
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
        <View style={orchardWoodsTopCoins}>
          <Image source={require('../../assets/images/coin.png')} />
          <Text style={orchardWoodsTopCoinsText}>x {coinsOrchardWoods}</Text>
        </View>

        <View style={orchardWoodsCenter}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goPrevOrchardWoods}
            style={orchardWoodsArrowL}
          >
            <Image source={require('../../assets/images/arrow_left.png')} />
          </TouchableOpacity>

          <ImageBackground
            source={require('../../assets/images/heroCardBoard.png')}
            style={[
              orchardWoodsCard,
              !ownedOrchardWoods &&
                heroOrchardWoods.price > 0 && { marginTop: 69 },
            ]}
            resizeMode="stretch"
          >
            <Text style={orchardWoodsTitle}>{heroOrchardWoods.name}</Text>

            <View style={orchardWoodsHeroWrap}>
              <Image
                source={heroOrchardWoods.image}
                style={orchardWoodsHeroImg}
                resizeMode="contain"
              />
            </View>

            <View style={orchardWoodsStats}>
              <View style={orchardWoodsRow}>
                <Image source={require('../../assets/images/heart.png')} />
                <Text style={orchardWoodsStatText}>
                  x {heroOrchardWoods.lives}
                </Text>
              </View>

              <View style={orchardWoodsRow}>
                <Text style={orchardWoodsStatLabel}>Bonus:</Text>
                <Image source={require('../../assets/images/coin.png')} />
                <Text style={orchardWoodsStatText}>
                  x {heroOrchardWoods.fixedBonusCoins}
                </Text>
              </View>

              <Text style={orchardWoodsFortune}>
                Royal Fortune: {heroOrchardWoods.royalFortune}%
              </Text>
            </View>
          </ImageBackground>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goNextOrchardWoods}
            style={orchardWoodsArrowR}
          >
            <Image source={require('../../assets/images/arrow_right.png')} />
          </TouchableOpacity>

          {!ownedOrchardWoods && heroOrchardWoods.price > 0 && (
            <ImageBackground
              source={require('../../assets/images/pricepill.png')}
              style={orchardWoodsPricePill}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsPriceText}>
                x {heroOrchardWoods.price}
              </Text>
            </ImageBackground>
          )}
        </View>

        <View style={orchardWoodsBottom}>
          {ownedOrchardWoods ? (
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={orchardWoodsBottomBtn}
              resizeMode="stretch"
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setUsingOrchardWoods(heroOrchardWoods.id)}
                disabled={isUsingOrchardWoods}
                style={orchardWoodsBtnTapFill}
              >
                <Text
                  style={[
                    orchardWoodsBottomBtnText,
                    isUsingOrchardWoods && { opacity: 0.8 },
                  ]}
                >
                  {isUsingOrchardWoods ? 'Using' : 'Use'}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={[
                orchardWoodsBottomBtn,
                !canBuyOrchardWoods && { opacity: 0.5 },
              ]}
              resizeMode="stretch"
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={buyHeroOrchardWoods}
                disabled={!canBuyOrchardWoods && heroOrchardWoods.price > 0}
                style={orchardWoodsBtnTapFill}
              >
                <Text style={orchardWoodsBottomBtnText}>
                  {heroOrchardWoods.price === 0 ? 'Use' : 'Get'}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigationOrchardWoods.goBack()}
            style={{ marginTop: 15 }}
          >
            <Image source={require('../../assets/images/homebtn.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const orchardWoodsBg = { flex: 1 };

const orchardWoodsTopCoins = {
  position: 'absolute' as const,
  top: 40,
  right: 22,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  zIndex: 50,
};

const orchardWoodsTopCoinsText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 20,
  marginLeft: 8,
  textShadowColor: '#00000090',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 6,
};

const orchardWoodsCenter = {
  flex: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginTop: 10,
};

const orchardWoodsArrowL = { position: 'absolute' as const, left: 18 };
const orchardWoodsArrowR = { position: 'absolute' as const, right: 18 };

const orchardWoodsCard = {
  width: 250,
  height: 399,
  alignItems: 'center' as const,
  justifyContent: 'flex-start' as const,
  paddingTop: 30,
};

const orchardWoodsTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
  marginBottom: 10,
};

const orchardWoodsHeroWrap = {
  height: 210,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsHeroImg = { width: 106, height: 190 };

const orchardWoodsStats = {
  alignItems: 'center' as const,
  marginTop: 2,
};

const orchardWoodsRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginTop: 2,
};

const orchardWoodsStatLabel = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 16,
  marginRight: 8,
};

const orchardWoodsStatText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 17,
  marginLeft: 8,
};

const orchardWoodsFortune = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 16,
  marginTop: 8,
};

const orchardWoodsPricePill = {
  height: 42,
  width: 115,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  marginTop: 30,
};

const orchardWoodsPriceText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 18,
  marginLeft: 8,
};

const orchardWoodsBottom = {
  paddingBottom: 34,
  alignItems: 'center' as const,
  marginTop: 30,
};

const orchardWoodsBottomBtn = {
  width: 110,
  height: 45,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsBtnTapFill = {
  width: '100%',
  height: '100%',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsBottomBtnText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 20,
};
