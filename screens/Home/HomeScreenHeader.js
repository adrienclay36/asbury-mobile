import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  Touchable,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
const emoji = require("node-emoji");
import { UserContext } from "../../store/UserProvider";
const HomeScreenHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);

  const welcomeComponent = userContext.userValue ? (
    <Text style={styles.welcome}>
      {emoji.get('wave')} Welcome, {userContext.userInfo?.first_name}!
    </Text>
  ) : (
    <Text style={styles.welcome}>Welcome!</Text>
  );

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      onPress={() => navigation.openDrawer()}
      source={{ uri: userContext.avatarURL }}
      size={30}
      style={{ backgroundColor: "transparent" }}
    />
  ) : (
    <Avatar.Image
      onPress={() => navigation.openDrawer()}
      source={require("../../assets/default-2.png")}
      size={30}
      style={{ backgroundColor: "transparent" }}
    />
  );

  return (
    <>
      <SafeAreaView style={styles.header}>
        <View style={styles.welcomeContainer}>
          {welcomeComponent}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {imageComponent}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : "transparent",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 15,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: Platform.OS === "android" ? 20 : 0,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
    color: Platform.OS === "android" ? Colors.white : Colors.black,
  },
  actionButtons: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
