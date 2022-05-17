import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
const FloatingBackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.backButton}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Entypo name="chevron-small-left" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingBackButton;

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 25,
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 5,
  },
});
