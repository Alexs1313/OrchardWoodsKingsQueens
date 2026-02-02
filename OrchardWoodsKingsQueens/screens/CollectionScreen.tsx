import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
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

type RootStackParamList = {
  HomeScreen: undefined;
  CollectionScreen: undefined;
};

type CardCfg = {
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

const CARDS: CardCfg[] = [
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [coins, setCoins] = useState(0);
  const [state, setState] = useState<CollectionState>({
    royalFruitGarden: 0,
    berryRainGlow: 0,
    berryForest: 0,
    berryCastle: 0,
  });
  const imageRef = useRef(null);

  const shareImage = async () => {
    try {
      const tmpUri = await captureRef(imageRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      let fileUri = tmpUri.startsWith('file://') ? tmpUri : 'file://' + tmpUri;
      const pathToCheck = fileUri.replace('file://', '');
      const exists = await RNFS.exists(pathToCheck);
      if (!exists) return;

      await Share.open({
        url: fileUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      if (!error?.message?.includes('User did not share')) {
        console.error('shareWallpaper error', error);
      }
    }
  };

  const load = useCallback(async () => {
    const c = await loadCoins();
    const st = await loadCollection();
    setCoins(c);
    setState(st);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const cards = useMemo(() => CARDS, []);

  return (
    <ImageBackground
      source={require('../../assets/images/mainappback.png')}
      style={s.bg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, height: 800 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topCoins}>
          <Image source={require('../../assets/images/coin.png')} />
          <Text style={s.topCoinsText}>x {coins}</Text>
        </View>

        <View style={s.grid}>
          {cards.map(cfg => {
            const mask = state[cfg.id] || 0;
            const bits = getBits(mask);
            const isComplete = mask === 15;

            return (
              <View key={cfg.id} style={s.cardWrap}>
                <ImageBackground
                  source={require('../../assets/images/collectionCardBoard.png')}
                  style={s.card}
                  resizeMode="stretch"
                >
                  <Text style={s.title}>{cfg.title}</Text>

                  {isComplete ? (
                    <Image
                      source={cfg.completeImage}
                      style={s.fullImg}
                      resizeMode="cover"
                      ref={imageRef}
                    />
                  ) : (
                    <View style={s.pieceGrid}>
                      <View style={s.pieceRow}>
                        <View style={s.pieceCell}>
                          {bits.tl ? (
                            <Image source={cfg.pieces.tl} style={s.pieceImg} />
                          ) : (
                            <View style={s.lockedCell} />
                          )}
                        </View>
                        <View style={s.pieceCell}>
                          {bits.tr ? (
                            <Image source={cfg.pieces.tr} style={s.pieceImg} />
                          ) : (
                            <View style={s.lockedCell} />
                          )}
                        </View>
                      </View>

                      <View style={s.pieceRow}>
                        <View style={s.pieceCell}>
                          {bits.bl ? (
                            <Image source={cfg.pieces.bl} style={s.pieceImg} />
                          ) : (
                            <View style={s.lockedCell} />
                          )}
                        </View>
                        <View style={s.pieceCell}>
                          {bits.br ? (
                            <Image source={cfg.pieces.br} style={s.pieceImg} />
                          ) : (
                            <View style={s.lockedCell} />
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </ImageBackground>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={mask !== 15}
                  style={{ marginTop: 10, opacity: mask === 15 ? 1 : 0.6 }}
                  onPress={() => shareImage()}
                >
                  <ImageBackground
                    source={require('../../assets/images/introBtn.png')}
                    style={s.downloadBtn}
                    resizeMode="stretch"
                  >
                    <Text style={s.downloadText}>Download</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          style={s.homeBtnWrap}
        >
          <Image source={require('../../assets/images/homebtn.png')} />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },

  topCoins: {
    position: 'absolute',
    top: 60,
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

  grid: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },

  cardWrap: {
    width: '48%',
    alignItems: 'center',
  },
  fullImg: {
    width: 130,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },

  card: {
    width: 163,
    height: 222,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  titleBar: {
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
  },
  pieceGrid: {
    width: 130,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pieceRow: {
    flex: 1,
    flexDirection: 'row',
  },
  pieceCell: {
    flex: 1,
    borderWidth: 0.5,
  },
  pieceImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lockedCell: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.715)',
  },

  downloadBtn: {
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    color: '#FFFFFF',
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
  homeBtnWrap: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
  },
});
