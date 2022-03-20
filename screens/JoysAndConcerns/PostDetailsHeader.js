import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
const IMAGE_SIZE = 50;
const NewPostHeader = ({ navigation, route, back, props, title }) => {
  const imageComponent = route.params?.avatarURL ? (
    <Avatar.Image
      style={{ backgroundColor: "transparent" }}
      source={{ uri: route.params?.avatarURL }}
      size={IMAGE_SIZE}
    />
  ) : (
    <Avatar.Image
      style={{ backgroundColor: "transparent" }}
      source={require("../../assets/default-2.png")}
      size={IMAGE_SIZE}
    />
  );
  return (
    <>
      <Appbar.Header
        style={[
          styles.header,
          {
            backgroundColor: Colors.grey200,
            marginTop:
              Platform.OS === "android" ? StatusBar.currentHeight + 30 : 30,
            marginBottom: 10,
          },
        ]}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        {imageComponent}
        <View>
          <Appbar.Content
            color={Colors.black}
            title={route.params?.formatName}
          />
          <Appbar.Content
            color={userColors.seaFoam400}
            title={route.params?.formatDate}
          />
        </View>
      </Appbar.Header>
    </>
  );
};

export default NewPostHeader;

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
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
    margin: 20,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
});
