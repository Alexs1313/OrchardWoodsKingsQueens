// src/screens/HeroesScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
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
import Toast from 'react-native-toast-message';

import { HEROES, type Hero, type HeroId } from '../data/heroes';
import { useStore } from '../store/context';

type RootStackParamList = {
  HomeScreen: undefined;
  HeroesScreen: undefined;
  Game: { level: number };
};

const COINS_KEY = 'BK_COINS_V1';
const HERO_STATE_KEY = 'BK_HERO_STATE_V1';

type HeroState = {
  owned: Record<HeroId, boolean>;
  selected: HeroId;
};

const defaultHeroState: HeroState = {
  owned: { rowan: true, elowen: false, bramble: false, nylara: false },
  selected: 'rowan',
};

export default function HeroesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [coins, setCoins] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [heroState, setHeroState] = useState<HeroState>(defaultHeroState);

  const { isEnabledVibration } = useStore(); // to re-render on store changes
  const hero: Hero = useMemo(() => HEROES[index], [index]);
  const owned = !!heroState.owned[hero.id];
  const isUsing = heroState.selected === hero.id;
  const canBuy = coins >= hero.price;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const load = useCallback(async () => {
    try {
      const rawCoins = await AsyncStorage.getItem(COINS_KEY);
      setCoins(rawCoins ? Number(JSON.parse(rawCoins)) || 0 : 0);
    } catch {}

    try {
      const raw = await AsyncStorage.getItem(HERO_STATE_KEY);
      if (!raw) {
        setHeroState(defaultHeroState);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<HeroState>;
      setHeroState({
        owned: { ...defaultHeroState.owned, ...(parsed.owned || {}) } as any,
        selected: (parsed.selected as HeroId) || defaultHeroState.selected,
      });
    } catch {
      setHeroState(defaultHeroState);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = async (next: { coins?: number; heroState?: HeroState }) => {
    const ops: Promise<any>[] = [];
    if (typeof next.coins === 'number') {
      ops.push(AsyncStorage.setItem(COINS_KEY, JSON.stringify(next.coins)));
    }
    if (next.heroState) {
      ops.push(
        AsyncStorage.setItem(HERO_STATE_KEY, JSON.stringify(next.heroState)),
      );
    }
    try {
      await Promise.all(ops);
    } catch {}
  };

  const goPrev = () => setIndex(i => (i - 1 + HEROES.length) % HEROES.length);
  const goNext = () => setIndex(i => (i + 1) % HEROES.length);

  const setUsing = async (id: HeroId) => {
    const nextState: HeroState = { ...heroState, selected: id };
    setHeroState(nextState);
    await persist({ heroState: nextState });
  };

  const buyHero = async () => {
    if (hero.price <= 0) {
      return setUsing(hero.id);
    }

    if (!canBuy) {
      isEnabledVibration && Vibration.vibrate(200);

      return;
    }

    const nextCoins = coins - hero.price;
    const nextState: HeroState = {
      owned: { ...heroState.owned, [hero.id]: true },
      selected: hero.id,
    };

    setCoins(nextCoins);
    setHeroState(nextState);
    await persist({ coins: nextCoins, heroState: nextState });

    Toast.show({
      type: 'success',
      text1: `Purchased ${hero.name}!`,
      position: 'top',
      visibilityTime: 1500,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={s.bg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topCoins}>
          <Image source={require('../../assets/images/coin.png')} />
          <Text style={s.topCoinsText}>x {coins}</Text>
        </View>

        <View style={s.center}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goPrev}
            style={s.arrowL}
          >
            <Image source={require('../../assets/images/arrow_left.png')} />
          </TouchableOpacity>

          <ImageBackground
            source={require('../../assets/images/heroCardBoard.png')}
            style={[s.card, !owned && hero.price > 0 && { marginTop: 69 }]}
            resizeMode="stretch"
          >
            <Text style={s.title}>{hero.name}</Text>

            <View style={s.heroWrap}>
              <Image
                source={hero.image}
                style={s.heroImg}
                resizeMode="contain"
              />
            </View>

            <View style={s.stats}>
              <View style={s.row}>
                <Image source={require('../../assets/images/heart.png')} />
                <Text style={s.statText}>x {hero.lives}</Text>
              </View>

              <View style={s.row}>
                <Text style={s.statLabel}>Bonus:</Text>
                <Image source={require('../../assets/images/coin.png')} />
                <Text style={s.statText}>x {hero.fixedBonusCoins}</Text>
              </View>

              <Text style={s.fortune}>Royal Fortune: {hero.royalFortune}%</Text>
            </View>
          </ImageBackground>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goNext}
            style={s.arrowR}
          >
            <Image source={require('../../assets/images/arrow_right.png')} />
          </TouchableOpacity>
          {!owned && hero.price > 0 && (
            <ImageBackground
              source={require('../../assets/images/pricepill.png')}
              style={s.pricePill}
              resizeMode="stretch"
            >
              <Text style={s.priceText}>x {hero.price}</Text>
            </ImageBackground>
          )}
        </View>

        <View style={s.bottom}>
          {owned ? (
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={s.bottomBtn}
              resizeMode="stretch"
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setUsing(hero.id)}
                disabled={isUsing}
                style={s.btnTapFill}
              >
                <Text style={[s.bottomBtnText, isUsing && { opacity: 0.8 }]}>
                  {isUsing ? 'Using' : 'Use'}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={require('../../assets/images/introBtn.png')}
              style={[s.bottomBtn, !canBuy && { opacity: 0.5 }]}
              resizeMode="stretch"
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={buyHero}
                disabled={!canBuy && hero.price > 0}
                style={s.btnTapFill}
              >
                <Text style={s.bottomBtnText}>
                  {hero.price === 0 ? 'Use' : 'Get'}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Image source={require('../../assets/images/homebtn.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  topCoins: {
    position: 'absolute',
    top: 40,
    right: 22,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
  },
  topCoinsText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
    marginLeft: 8,
    textShadowColor: '#00000090',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  arrowL: { position: 'absolute', left: 18 },
  arrowR: { position: 'absolute', right: 18 },
  card: {
    width: 250,
    height: 399,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  titleBar: {
    width: 250,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
    marginBottom: 10,
  },
  heroWrap: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImg: { width: 106, height: 190 },
  stats: {
    alignItems: 'center',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statLabel: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 17,
    marginRight: 8,
  },
  statText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  fortune: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
    marginTop: 8,
  },
  pricePill: {
    height: 42,
    width: 115,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  priceText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  bottom: {
    paddingBottom: 34,
    alignItems: 'center',
    marginTop: 30,
  },
  bottomBtn: {
    width: 110,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTapFill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
  },
});
