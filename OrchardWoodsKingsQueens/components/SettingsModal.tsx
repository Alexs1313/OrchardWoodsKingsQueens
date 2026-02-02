import React from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { NeonModalSquare } from '../screens/HomeScreen';

type SettingsModalProps = {
  setupVisible: boolean;
  setSetupVisible: (value: boolean) => void;

  isEnabledSound: boolean;
  toggleMusic: (value: boolean) => void;
  resetVisible?: boolean;

  isEnabledVibration: boolean;
  toggleVibration: (value: boolean) => void;

  handleShare: () => void;
  setResetVisible: (value: boolean) => void;

  setRulesVisible: (value: boolean) => void;
  resetProgress: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  setupVisible,
  setSetupVisible,
  isEnabledSound,
  toggleMusic,
  setRulesVisible,
  isEnabledVibration,
  toggleVibration,
  handleShare,
  setResetVisible,
  resetProgress,
}) => {
  return (
    <Modal visible={setupVisible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <NeonModalSquare
          title="Settings"
          onClose={() => setSetupVisible(false)}
        >
          <View style={styles.setupRow}>
            <TouchableOpacity onPress={() => toggleMusic(!isEnabledSound)}>
              <Image
                source={
                  isEnabledSound
                    ? require('../../assets/images/musiconicon.png')
                    : require('../../assets/images/musicofficon.png')
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleVibration(!isEnabledVibration)}
            >
              <Image
                source={
                  isEnabledVibration
                    ? require('../../assets/images/vibroonicon.png')
                    : require('../../assets/images/vibroofficon.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={{ height: 18 }} />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 20,
              width: '100%',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSetupVisible(false);
                setRulesVisible(true);
              }}
            >
              <Image source={require('../../assets/images/abouticon.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                resetProgress();
                setSetupVisible(false);
              }}
            >
              <Image source={require('../../assets/images/reseticon.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare()}>
              <Image source={require('../../assets/images/shareappicon.png')} />
            </TouchableOpacity>
          </View>
        </NeonModalSquare>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00247273',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    marginTop: 50,
  },
});

export default SettingsModal;
