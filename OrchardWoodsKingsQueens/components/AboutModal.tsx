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
            Welcome to QueensMinn: Kings Woods — a cozy fantasy adventure where
            every journey is a new story. Choose your hero, explore the Berry
            Kingdom, and face unexpected moments across 10 steps. Each step
            brings a random event: sometimes luck is on your side, sometimes
            you’ll need to stay strong and continue. Collect coins, unlock new
            heroes with better bonuses, and complete the artifact collection by
            finding all pieces of the kingdom’s hidden images. Relax, enjoy the
            atmosphere, and see how far your hero can go in the enchanted woods.
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
