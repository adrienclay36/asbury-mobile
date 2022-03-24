import {
  Dimensions,
  Platform,
  PlatformColor,
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
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "android" ? height * 0.14 : height * 0.15;
const EditProfileScreenHeader = ({ navigation, saveChanges, loading }) => {
  const userContext = useContext(UserContext);


  const headerComponent = userContext.userInfo ? (
    <Text style={styles.headerText}>{userContext.formatName}</Text>
  ) : (
    <Text style={styles.headerText}>New Post</Text>
  );

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      style={styles.avatar}
      size={AVATAR_SIZE}
      source={{ uri: userContext.avatarURL }}
    />
  ) : (
    <Avatar.Image
      style={styles.avatar}
      size={AVATAR_SIZE}
      source={require("../../assets/default-2.png")}
    />
  );

  return (
    <>
      <SafeAreaView style={styles.header}>
        <View style={styles.contentContainer}>
            <View style={{ flexDirection: 'row'}}>

          <Appbar.BackAction
            color={Platform.OS === "android" ? Colors.white : Colors.grey700}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.userContainer}>
            {imageComponent}
          </View>
            </View>
            <Text style={styles.headerText}>Change Password</Text>
          <Button
            onPress={saveChanges}
            mode={Platform.OS === "android" ? "outlined" : "contained"}
            key={loading}
            loading={loading}
            disabled={loading}
            style={{
              backgroundColor:
                Platform.OS === "android"
                  ? Colors.blueGrey800
                  : userColors.seaFoam600,
            }}
            color={
              Platform.OS === "android" ? Colors.white : userColors.seaFoam600
            }
          >
            Save
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EditProfileScreenHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : Colors.grey200,
    height: HEADER_HEIGHT,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:
      Platform.OS === "android" ? HEADER_HEIGHT / 8 : HEADER_HEIGHT / 6,
    marginHorizontal: 10,
  },
  userContainer: {
  },
  avatar: {
    backgroundColor: "transparent",
  },
  headerText: {
    color: Platform.OS === "android" ? Colors.white : Colors.black,
    fontFamily: primaryFont.semiBold,
  },
});
