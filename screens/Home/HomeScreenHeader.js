import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  Touchable,
  useColorScheme,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
const emoji = require("node-emoji");
import { UserContext } from "../../store/UserProvider";
const HomeScreenHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);

  const welcomeComponent = userContext.userValue ? (
    <>
      <View>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.name}>{userContext.userInfo?.first_name}</Text>
      </View>
    </>
  ) : (
    <Text style={styles.welcome}>Welcome Back</Text>
  );

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      onPress={() => navigation.openDrawer()}
      source={{ uri: userContext.avatarURL }}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  ) : (
    <Avatar.Image
      onPress={() => navigation.openDrawer()}
      source={require("../../assets/default-2.png")}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  );

  return (
    <>
      <SafeAreaView forceInset={{ top: "never" }} style={styles.header}>
        <View style={styles.welcomeContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {imageComponent}
              {welcomeComponent}
            </View>
          </TouchableOpacity>
          <Appbar.Action
            icon="menu"
            size={30}
            color={Platform.OS === "android" ? Colors.white : Colors.grey900}
            onPress={() => navigation.openDrawer()}
          />
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
    marginLeft: 30,
    marginRight: 10,
    marginBottom: Platform.OS === "android" ? 20 : -10,
  },
  welcome: {
    fontSize: 14,
    fontWeight: "600",
    color: Platform.OS === "android" ? Colors.grey300 : Colors.grey500,
    marginLeft: 10,
  },
  name: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
    color: Platform.OS === 'android' ? Colors.white : Colors.grey900
  },
  actionButtons: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
