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
import UserHeader from "../../components/Headers/UserHeader";
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT =
  Platform.OS === "android" ? height * 0.13 : height * 0.109;
const OneTimeDonationHeader = ({
  navigation,
  submitPaymentHandler,
  loading
}) => {
  const userContext = useContext(UserContext);
  const prayerContext = useContext(PrayerContext);

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
      <UserHeader>
        <Appbar.BackAction
          style={{
            marginLeft: 20,
            transform: [{ rotate: Platform.OS === "ios" ? "-90deg" : "0deg" }],
          }}
          color={Platform.OS === "android" ? Colors.white : Colors.grey700}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.userContainer}>
          {imageComponent}
          {headerComponent}
        </View>
        <Button
          onPress={submitPaymentHandler}
          loading={loading}
          key={loading}
          disabled={loading}
          mode={Platform.OS === "android" ? "outlined" : "contained"}
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
          Pay
        </Button>
      </UserHeader>
    </>
  );
};

export default OneTimeDonationHeader;

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
