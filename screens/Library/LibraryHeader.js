import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { UserContext } from "../../store/UserProvider";
const LibraryHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);

  const welcomeComponent = userContext.userInfo ? (
    <Text style={styles.welcome}>
      Welcome, {userContext.userInfo.first_name}!
    </Text>
  ) : (
    <Text style={styles.welcome}>Welcome!</Text>
  );

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      source={{ uri: userContext.avatarURL }}
      size={30}
      style={{ backgroundColor: "transparent" }}
    />
  ) : (
    <Avatar.Image
      source={require("../../assets/default-2.png")}
      size={30}
      style={{ backgroundColor: "transparent" }}
    />
  );

  return (
    <>
      <SafeAreaView>
        <View style={styles.userHeader}>
          {welcomeComponent}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {imageComponent}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LibraryHeader;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40,
    height: 100,
    backgroundColor: userColors.seaFoam500,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
});
