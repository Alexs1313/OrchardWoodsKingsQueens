import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';

import {
  loadCoins,
  loadCollection,
  type CollectionId,
  type CollectionState,
  getBits,
} from '../utils/collectionStorage';

type RootStackParamListOrchardWoods = {
  HomeScreen: undefined;
  CollectionScreen: undefined;
};

type CardCfgOrchardWoods = {
  id: CollectionId;
  title: string;

  pieces: {
    tl: any;
    tr: any;
    bl: any;
    br: any;
  };
  completeImage: any;
};

const CARDS_ORCHARD_WOODS: CardCfgOrchardWoods[] = [
  {
    id: 'royalFruitGarden',
    title: 'Royal Fruit Garden',
    pieces: {
      tl: require('../../assets/images/collection/rfg_tl.png'),
      tr: require('../../assets/images/collection/rfg_tr.png'),
      bl: require('../../assets/images/collection/rfg_bl.png'),
      br: require('../../assets/images/collection/rfg_br.png'),
    },
    completeImage: require('../../assets/images/collection/rfg_full.png'),
  },
  {
    id: 'berryRainGlow',
    title: 'Berry Rain Glow',
    pieces: {
      tl: require('../../assets/images/collection/brg_tl.png'),
      tr: require('../../assets/images/collection/brg_tr.png'),
      bl: require('../../assets/images/collection/brg_bl.png'),
      br: require('../../assets/images/collection/brg_br.png'),
    },
    completeImage: require('../../assets/images/collection/brg_full.png'),
  },
  {
    id: 'berryForest',
    title: 'Berry Forest',
    pieces: {
      tl: require('../../assets/images/collection/bf_tl.png'),
      tr: require('../../assets/images/collection/bf_tr.png'),
      bl: require('../../assets/images/collection/bf_bl.png'),
      br: require('../../assets/images/collection/bf_br.png'),
    },
    completeImage: require('../../assets/images/collection/bf_full.png'),
  },
  {
    id: 'berryCastle',
    title: 'Berry Castle',
    pieces: {
      tl: require('../../assets/images/collection/bc_tl.png'),
      tr: require('../../assets/images/collection/bc_tr.png'),
      bl: require('../../assets/images/collection/bc_bl.png'),
      br: require('../../assets/images/collection/bc_br.png'),
    },
    completeImage: require('../../assets/images/collection/bc_full.png'),
  },
];

export default function CollectionScreen() {
  const navigationOrchardWoods =
    useNavigation<NavigationProp<RootStackParamListOrchardWoods>>();

  const [coinsOrchardWoods, setCoinsOrchardWoods] = useState(0);
  const [stateOrchardWoods, setStateOrchardWoods] = useState<CollectionState>({
    royalFruitGarden: 0,
    berryRainGlow: 0,
    berryForest: 0,
    berryCastle: 0,
  });

  const imageRefOrchardWoods = useRef(null);

  const shareImageOrchardWoods = async () => {
    try {
      const tmpUriOrchardWoods = await captureRef(imageRefOrchardWoods, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const fileUriOrchardWoods = tmpUriOrchardWoods.startsWith('file://')
        ? tmpUriOrchardWoods
        : 'file://' + tmpUriOrchardWoods;

      const pathToCheckOrchardWoods = fileUriOrchardWoods.replace(
        'file://',
        '',
      );
      const existsOrchardWoods = await RNFS.exists(pathToCheckOrchardWoods);
      if (!existsOrchardWoods) return;

      await Share.open({
        url: fileUriOrchardWoods,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      if (!error?.message?.includes('User did not share')) {
        console.error('shareWallpaper error', error);
      }
    }
  };

  const loadOrchardWoods = useCallback(async () => {
    const cOrchardWoods = await loadCoins();
    const stOrchardWoods = await loadCollection();
    setCoinsOrchardWoods(cOrchardWoods);
    setStateOrchardWoods(stOrchardWoods);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrchardWoods();
    }, [loadOrchardWoods]),
  );

  const cardsOrchardWoods = useMemo(() => CARDS_ORCHARD_WOODS, []);

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
        <View style={orchardWoodsTopCoins}>
          <Image source={require('../../assets/images/coin.png')} />
          <Text style={orchardWoodsTopCoinsText}>x {coinsOrchardWoods}</Text>
        </View>

        <View style={orchardWoodsGrid}>
          {cardsOrchardWoods.map(cfgOrchardWoods => {
            const maskOrchardWoods = stateOrchardWoods[cfgOrchardWoods.id] || 0;
            const bitsOrchardWoods = getBits(maskOrchardWoods);
            const isCompleteOrchardWoods = maskOrchardWoods === 15;

            return (
              <View key={cfgOrchardWoods.id} style={orchardWoodsCardWrap}>
                <ImageBackground
                  source={require('../../assets/images/collectionCardBoard.png')}
                  style={orchardWoodsCard}
                  resizeMode="stretch"
                >
                  <Text style={orchardWoodsTitle}>{cfgOrchardWoods.title}</Text>

                  {isCompleteOrchardWoods ? (
                    <Image
                      source={cfgOrchardWoods.completeImage}
                      style={orchardWoodsFullImg}
                      resizeMode="cover"
                      ref={imageRefOrchardWoods as any}
                    />
                  ) : (
                    <View style={orchardWoodsPieceGrid}>
                      <View style={orchardWoodsPieceRow}>
                        <View style={orchardWoodsPieceCell}>
                          {bitsOrchardWoods.tl ? (
                            <Image
                              source={cfgOrchardWoods.pieces.tl}
                              style={orchardWoodsPieceImg}
                            />
                          ) : (
                            <View style={orchardWoodsLockedCell} />
                          )}
                        </View>
                        <View style={orchardWoodsPieceCell}>
                          {bitsOrchardWoods.tr ? (
                            <Image
                              source={cfgOrchardWoods.pieces.tr}
                              style={orchardWoodsPieceImg}
                            />
                          ) : (
                            <View style={orchardWoodsLockedCell} />
                          )}
                        </View>
                      </View>

                      <View style={orchardWoodsPieceRow}>
                        <View style={orchardWoodsPieceCell}>
                          {bitsOrchardWoods.bl ? (
                            <Image
                              source={cfgOrchardWoods.pieces.bl}
                              style={orchardWoodsPieceImg}
                            />
                          ) : (
                            <View style={orchardWoodsLockedCell} />
                          )}
                        </View>
                        <View style={orchardWoodsPieceCell}>
                          {bitsOrchardWoods.br ? (
                            <Image
                              source={cfgOrchardWoods.pieces.br}
                              style={orchardWoodsPieceImg}
                            />
                          ) : (
                            <View style={orchardWoodsLockedCell} />
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </ImageBackground>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={maskOrchardWoods !== 15}
                  style={{
                    marginTop: 10,
                    opacity: maskOrchardWoods === 15 ? 1 : 0.6,
                  }}
                  onPress={shareImageOrchardWoods}
                >
                  <ImageBackground
                    source={require('../../assets/images/introBtn.png')}
                    style={orchardWoodsDownloadBtn}
                    resizeMode="stretch"
                  >
                    <Text style={orchardWoodsDownloadText}>Download</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigationOrchardWoods.goBack()}
          style={orchardWoodsHomeBtnWrap}
        >
          <Image source={require('../../assets/images/homebtn.png')} />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const orchardWoodsBg = { flex: 1 };

const orchardWoodsTopCoins = {
  position: 'absolute' as const,
  top: 60,
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

const orchardWoodsGrid = {
  flex: 1,
  paddingTop: 120,
  paddingHorizontal: 16,
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  justifyContent: 'space-between' as const,
  rowGap: 18,
};

const orchardWoodsCardWrap = {
  width: '48%',
  alignItems: 'center' as const,
};

const orchardWoodsFullImg = {
  width: 130,
  height: 150,
  borderRadius: 10,
  overflow: 'hidden' as const,
};

const orchardWoodsCard = {
  width: 163,
  height: 222,
  alignItems: 'center' as const,
  paddingTop: 20,
  paddingHorizontal: 10,
};

const orchardWoodsTitle = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 12,
  textAlign: 'center' as const,
  marginBottom: 18,
};

const orchardWoodsPieceGrid = {
  width: 130,
  height: 150,
  borderRadius: 10,
  overflow: 'hidden' as const,
};

const orchardWoodsPieceRow = {
  flex: 1,
  flexDirection: 'row' as const,
};

const orchardWoodsPieceCell = {
  flex: 1,
  borderWidth: 0.5,
};

const orchardWoodsPieceImg = {
  width: '100%',
  height: '100%',
  resizeMode: 'cover' as const,
};

const orchardWoodsLockedCell = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.715)',
};

const orchardWoodsDownloadBtn = {
  width: 120,
  height: 40,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const orchardWoodsDownloadText = {
  color: '#FFFFFF',
  fontFamily: 'Sansation-Bold',
  fontSize: 16,
};

const orchardWoodsHomeBtnWrap = {
  position: 'absolute' as const,
  bottom: 34,
  alignSelf: 'center' as const,
};
