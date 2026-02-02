import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { NeonModalTall } from '../screens/HomeScreen';

type AboutModalProps = {
  rulesVisible: boolean;
  setRulesVisible: (value: boolean) => void;
};

const AboutModal: React.FC<AboutModalProps> = ({
  rulesVisible,
  setRulesVisible,
}) => {
  return (
    <Modal visible={rulesVisible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <NeonModalTall title="About App" onClose={() => setRulesVisible(false)}>
          <Text style={styles.rulesText}>
            Guide the ball from the top of the field to the goal at the bottom
            by tapping on the round grass platforms. Some platforms contain
            hidden spikes. If you step on one, the ball pops and the level
            restarts. After you safely pass a row, all spikes in that row are
            revealed. Use this information to remember where the traps are and
            choose a safe path forward. Every row always has at least one safe
            platform, so each level can be completed. Your task is to avoid the
            spikes, reach the goal, and unlock the next level.
          </Text>
        </NeonModalTall>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rulesText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 25,
    fontFamily: 'Sansation-Regular',
    paddingHorizontal: 10,
  },
});

export default AboutModal;
