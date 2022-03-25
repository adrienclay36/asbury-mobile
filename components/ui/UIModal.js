import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Portal, Modal, Colors } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
const {height, width} = Dimensions.get('window')
const UIModal = ({ type, text, showModal, dismissModal, errorMessage }) => {
  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.successModal}
        visible={showModal}
        onDismiss={dismissModal ? dismissModal : null}
      >
        <View style={{ alignItems: "center" }}>
          {type === "success" && (
            <Feather
              style={styles.modalIcon}
              name="check-circle"
              color={Colors.green600}
              size={50}
            />
          )}
          {type === "error" && (
            <Feather
              style={styles.modalIcon}
              name="x-circle"
              color={Colors.red700}
              size={50}
            />
          )}
          <Text style={styles.modalText}>{text}</Text>
          {errorMessage && <Text style={styles.modalText}>{errorMessage}</Text>}
        </View>
      </Modal>
    </Portal>
  );
}

export default UIModal

const styles = StyleSheet.create({
  successModal: {
    backgroundColor: Colors.white,
    height: height * 0.2,
    marginHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  modalText: {
    textAlign: "center",
    fontWeight: "500",
    marginHorizontal: 20,
  },
  modalIcon: {
    marginBottom: 15,
  },
});