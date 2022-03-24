import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { UserContext } from "../../store/UserProvider";
const ProgramsHomeHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);

  const welcomeComponent = userContext.userValue ? (
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
      <SafeAreaView
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Appbar.Content
          title="Weekly Program"
          subtitle="Sundays @ 8:00 AM and 11:00AM"
          subtitleStyle={{ color: Colors.grey700 }}
          titleStyle={{ color: Colors.black }}
        />
        <Appbar.Action
          icon="menu"
          size={30}
          color={Colors.grey900}
          onPress={() => navigation.openDrawer()}
        />
      </SafeAreaView>
    </>
  );
};

export default ProgramsHomeHeader;

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
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
  actionButtons: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
