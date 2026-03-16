import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import {
  LEGENDS_ORCHARD_WOODS,
  STORAGE_SAVED_LEGENDS_ORCHARD_WOODS,
} from '../data/legendsData';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  CollectionLegendDetails: { legendId: string };
};

export default function OrchwddscollectnDetail() {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();
  const routeOrchardWoods =
    useRoute<
      RouteProp<RootStackParamListOrchardWoods, 'CollectionLegendDetails'>
    >();

  const legendIdOrchardWoods = routeOrchardWoods.params.legendId;
  const legendOrchardWoods = useMemo(
    () =>
      LEGENDS_ORCHARD_WOODS.find(
        itemOrchardWoods => itemOrchardWoods.id === legendIdOrchardWoods,
      ) ?? LEGENDS_ORCHARD_WOODS[0],
    [legendIdOrchardWoods],
  );

  const [savedIdsOrchardWoods, setSavedIdsOrchardWoods] = useState<string[]>(
    [],
  );

  const loadSavedOrchardWoods = useCallback(async () => {
    try {
      const rawOrchardWoods = await AsyncStorage.getItem(
        STORAGE_SAVED_LEGENDS_ORCHARD_WOODS,
      );
      if (!rawOrchardWoods) {
        setSavedIdsOrchardWoods([]);
        return;
      }
      const parsedOrchardWoods = JSON.parse(rawOrchardWoods) as string[];
      setSavedIdsOrchardWoods(
        Array.isArray(parsedOrchardWoods) ? parsedOrchardWoods : [],
      );
    } catch {
      setSavedIdsOrchardWoods([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedOrchardWoods().catch(() => {});
    }, [loadSavedOrchardWoods]),
  );

  const isSavedOrchardWoods = savedIdsOrchardWoods.includes(
    legendOrchardWoods.id,
  );

  const toggleSavedOrchardWoods = async () => {
    const nextSavedOrchardWoods = isSavedOrchardWoods
      ? savedIdsOrchardWoods.filter(x => x !== legendOrchardWoods.id)
      : [...savedIdsOrchardWoods, legendOrchardWoods.id];

    setSavedIdsOrchardWoods(nextSavedOrchardWoods);
    try {
      await AsyncStorage.setItem(
        STORAGE_SAVED_LEGENDS_ORCHARD_WOODS,
        JSON.stringify(nextSavedOrchardWoods),
      );
    } catch {}
  };

  const shareOrchardWoods = async () => {
    try {
      await Share.share({
        message: `${legendOrchardWoods.title}\n\n${legendOrchardWoods.text}`,
      });
    } catch {}
  };

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={orchardWoodsBg}
      resizeMode="cover"
    >
      <View style={orchardWoodsRoot}>
        <ImageBackground
          source={require('../../assets/images/orchrdwdlargcard.png')}
          style={orchardWoodsStoryBoard}
          resizeMode="stretch"
        >
          <Text style={orchardWoodsTitle}>{legendOrchardWoods.title}</Text>

          <Image
            source={legendOrchardWoods.image}
            style={orchardWoodsImage}
            resizeMode="cover"
          />

          <ScrollView
            style={orchardWoodsTextScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={orchardWoodsText}>{legendOrchardWoods.text}</Text>
          </ScrollView>

          <View style={orchardWoodsInnerActions}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                toggleSavedOrchardWoods().catch(() => {});
              }}
            >
              <Image
                source={
                  isSavedOrchardWoods
                    ? require('../../assets/images/orchrdwdsvd.png')
                    : require('../../assets/images/orchrdwddsv.png')
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                shareOrchardWoods().catch(() => {});
              }}
            >
              <Image source={require('../../assets/images/orchrdwddshr.png')} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={orchardWoodsBottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ position: 'absolute', left: 0, top: 5 }}
            onPress={() => navigationOrchardWoods.goBack()}
          >
            <Image source={require('../../assets/images/arrow_left.png')} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigationOrchardWoods.navigate('HomeScreen')}
          >
            <Image source={require('../../assets/images/homebtn.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const orchardWoodsBg = { flex: 1 };

const orchardWoodsRoot = {
  flex: 1,
  justifyContent: 'center' as const,
  paddingHorizontal: 24,
  paddingTop: 44,
  paddingBottom: 24,
};

const orchardWoodsStoryBoard = {
  height: 620,
  paddingTop: 24,
  paddingHorizontal: 18,
  paddingBottom: 18,
};

const orchardWoodsTitle = {
  color: '#FFFFFF',
  textAlign: 'center' as const,
  fontSize: 16,

  fontFamily: 'Sansation-Bold',
  marginBottom: 12,
};

const orchardWoodsImage = {
  width: 190,
  height: 190,
  alignSelf: 'center' as const,
};

const orchardWoodsTextScroll = {
  flex: 1,
  marginTop: 12,
};

const orchardWoodsText = {
  color: '#FFFFFF',
  fontSize: 14,

  fontFamily: 'Sansation-Regular',
  paddingBottom: 12,
};

const orchardWoodsInnerActions = {
  marginTop: 8,
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  paddingHorizontal: 2,
};

const orchardWoodsBottomRow = {
  marginTop: 20,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  paddingHorizontal: 6,
};
