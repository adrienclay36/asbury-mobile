import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Share,
  StatusBar,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { UserContext } from "../../store/UserProvider";
import { onShare } from "../../helpers/onShare";
import { SafeAreaView } from "react-native-safe-area-context";
const BASE_URL = `https://asbury-next-website.vercel.app/blog`;
const IMAGE_SIZE = 30;
import { useNavigation } from "@react-navigation/native";
const DrawerHeader = () => {
    const navigation = useNavigation();
  return (
    <>
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          },
        ]}
      >
        <Appbar.Action
          icon="menu"
          size={30}
          color={Colors.grey900}
          onPress={() => navigation.openDrawer()}
        />
      </View>
    </>
  );
};

export default DrawerHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: Dimensions.get("window").height * 0.1,
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
});
