import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import {
  LEGENDS_ORCHARD_WOODS,
  STORAGE_SAVED_LEGENDS_ORCHARD_WOODS,
} from '../data/legendsData';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  CollectionScreen: undefined;
  CollectionLegendDetails: { legendId: string };
};

type FilterTabOrchardWoods = 'all' | 'saved';

export default function Orchwddscollectn() {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const [tabOrchardWoods, setTabOrchardWoods] =
    useState<FilterTabOrchardWoods>('all');
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

  const toggleSavedOrchardWoods = async (idOrchardWoods: string) => {
    const nextSavedOrchardWoods = savedIdsOrchardWoods.includes(idOrchardWoods)
      ? savedIdsOrchardWoods.filter(x => x !== idOrchardWoods)
      : [...savedIdsOrchardWoods, idOrchardWoods];
    setSavedIdsOrchardWoods(nextSavedOrchardWoods);
    try {
      await AsyncStorage.setItem(
        STORAGE_SAVED_LEGENDS_ORCHARD_WOODS,
        JSON.stringify(nextSavedOrchardWoods),
      );
    } catch {}
  };

  const filteredLegendsOrchardWoods = useMemo(() => {
    if (tabOrchardWoods === 'all') return LEGENDS_ORCHARD_WOODS;
    return LEGENDS_ORCHARD_WOODS.filter(legendOrchardWoods =>
      savedIdsOrchardWoods.includes(legendOrchardWoods.id),
    );
  }, [savedIdsOrchardWoods, tabOrchardWoods]);

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={orchardWoodsBg}
      resizeMode="cover"
    >
      <View style={orchardWoodsRoot}>
        <View style={orchardWoodsTabsRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTabOrchardWoods('all')}
          >
            <ImageBackground
              source={require('../../assets/images/homemainBtn.png')}
              style={[
                orchardWoodsTabBtn,
                tabOrchardWoods !== 'all' && orchardWoodsTabBtnInactive,
              ]}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsTabText}>All</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTabOrchardWoods('saved')}
          >
            <ImageBackground
              source={require('../../assets/images/homemainBtn.png')}
              style={[
                orchardWoodsTabBtn,
                tabOrchardWoods !== 'saved' && orchardWoodsTabBtnInactive,
              ]}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsTabText}>Saved</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {tabOrchardWoods === 'saved' &&
        filteredLegendsOrchardWoods.length === 0 ? (
          <View style={orchardWoodsEmptyWrap}>
            <ImageBackground
              source={require('../../assets/images/orchrdwddbrrd.png')}
              style={orchardWoodsEmptyCard}
              resizeMode="stretch"
            >
              <Text style={orchardWoodsEmptyTitle}>
                No favorite legends yet
              </Text>
              <Text style={orchardWoodsEmptySubtitle}>
                Mark legends you like{'\n'}to find them here anytime.
              </Text>
              <Image
                source={require('../../assets/images/orchrdwdlaempthe.png')}
              />
            </ImageBackground>

            <Image
              source={require('../../assets/images/orchrdwdlaremptbook.png')}
            />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={orchardWoodsList}
          >
            {filteredLegendsOrchardWoods.map(legendOrchardWoods => {
              const isSavedOrchardWoods = savedIdsOrchardWoods.includes(
                legendOrchardWoods.id,
              );
              return (
                <ImageBackground
                  key={legendOrchardWoods.id}
                  source={require('../../assets/images/orchrdwddbrrd.png')}
                  style={orchardWoodsLegendCard}
                  resizeMode="stretch"
                >
                  <Image
                    source={legendOrchardWoods.image}
                    style={orchardWoodsLegendImage}
                    resizeMode="cover"
                  />
                  <View style={orchardWoodsLegendInfo}>
                    <Text style={orchardWoodsLegendTitle}>
                      {legendOrchardWoods.title}
                    </Text>
                    <View style={orchardWoodsActionsRow}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          toggleSavedOrchardWoods(legendOrchardWoods.id).catch(
                            () => {},
                          );
                        }}
                        style={orchardWoodsActionBtn}
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
                        onPress={() =>
                          navigationOrchardWoods.navigate(
                            'CollectionLegendDetails',
                            {
                              legendId: legendOrchardWoods.id,
                            },
                          )
                        }
                        style={orchardWoodsActionBtn}
                      >
                        <Image
                          source={require('../../assets/images/orchrdwdpll.png')}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          navigationOrchardWoods.navigate(
                            'CollectionLegendDetails',
                            {
                              legendId: legendOrchardWoods.id,
                            },
                          )
                        }
                        style={orchardWoodsActionBtn}
                      >
                        <Image
                          source={require('../../assets/images/orchrdwddshr.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              );
            })}
          </ScrollView>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigationOrchardWoods.goBack()}
          style={orchardWoodsHomeBtnWrap}
        >
          <Image source={require('../../assets/images/homebtn.png')} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const orchardWoodsBg = { flex: 1 };

const orchardWoodsRoot = {
  flex: 1,
  paddingTop: 56,
};

const orchardWoodsTabsRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  paddingHorizontal: 30,
};

const orchardWoodsTabBtn = {
  width: 136,
  height: 55,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const orchardWoodsTabBtnInactive = {
  opacity: 0.45,
};

const orchardWoodsTabText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 22,
};

const orchardWoodsList = {
  paddingHorizontal: 16,
  paddingTop: 18,
  paddingBottom: 120,
  rowGap: 16,
};

const orchardWoodsLegendCard = {
  width: '100%' as const,
  minHeight: 124,
  borderRadius: 18,
  overflow: 'hidden' as const,
  flexDirection: 'row' as const,
};

const orchardWoodsLegendImage = {
  width: '52%' as const,
  height: 124,
};

const orchardWoodsLegendInfo = {
  flex: 1,
  justifyContent: 'space-between' as const,
  paddingVertical: 16,
  paddingHorizontal: 12,
};

const orchardWoodsLegendTitle = {
  color: '#FFFFFF',
  fontSize: 16,
  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsActionsRow = {
  flexDirection: 'row' as const,
  gap: 10,
  justifyContent: 'center' as const,
};

const orchardWoodsActionBtn = {
  width: 36,
  height: 36,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#F6CD3A',
  backgroundColor: '#5D2CDA',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsHomeBtnWrap = {
  position: 'absolute' as const,
  bottom: 30,
  alignSelf: 'center' as const,
};

const orchardWoodsEmptyWrap = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const orchardWoodsEmptyCard = {
  paddingHorizontal: 20,
  paddingVertical: 18,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  alignSelf: 'center' as const,
  width: 300 as const,
  marginBottom: 50,
};

const orchardWoodsEmptyTitle = {
  color: '#FFFFFF',
  fontSize: 16,

  textAlign: 'center' as const,
  fontFamily: 'Sansation-Bold',
};

const orchardWoodsEmptySubtitle = {
  color: '#FFFFFF',
  fontSize: 15,

  textAlign: 'center' as const,
  marginTop: 10,
  marginBottom: 20,

  fontFamily: 'Sansation-Bold',
};

const orchardWoodsEmptyHeart = {
  width: 42,
  height: 42,
  marginTop: 14,
  tintColor: '#F9D94D',
};

const orchardWoodsEmptyBook = {
  width: 260,
  height: 150,
  marginTop: 32,
};
