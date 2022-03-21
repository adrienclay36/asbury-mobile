import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT =
  Platform.OS === "android" ? height * 0.13 : height * 0.109;
const NewPostHeader = ({ navigation, submitPostHandler, children, style }) => {

  return (
    <>
      <View style={[styles.header, {...style}]}>
        <View style={styles.contentContainer}>
          {children}
        </View>
      </View>
    </>
  );
};

export default NewPostHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : Colors.grey300,
    height: HEADER_HEIGHT,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: HEADER_HEIGHT / 6,
    marginHorizontal: 20,
  },
  userContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: "transparent",
  },
  headerText: {
    color: Platform.OS === "android" ? Colors.white : Colors.black,
    fontFamily: primaryFont.semiBold,
  },
});
