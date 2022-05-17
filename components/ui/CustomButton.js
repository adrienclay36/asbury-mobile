import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { userColors } from "../../constants/userColors";
import { primaryFont } from "../../constants/fonts";

const CustomButton = ({
  text,
  onPress = () => {},
  mode = "outlined",
  leftIcon = null,
  backgroundColor = null,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonOutlined, leftIcon && styles.withIcon]}>
        {leftIcon}
      <Text style={[styles.buttonText, leftIcon && { marginLeft: 10, }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonOutlined: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 40,
  },
  withIcon: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

  },
  buttonText: {
    color: "white",
    fontFamily: primaryFont.semiBold,
    fontSize: 16,
  },
});
