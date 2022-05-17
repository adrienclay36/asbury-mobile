import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Share,
  StatusBar,
} from "react-native";
import React, { useContext } from "react";
import { Appbar, Avatar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { UserContext } from "../../store/UserProvider";
const BASE_URL = `https://asbury-next-website.vercel.app/blog`;
const IMAGE_SIZE = 30;
import { useNavigation } from "@react-navigation/native";
const JoysAndConcernsHeader = () => {
  const navigation = useNavigation();
  const userContext = useContext(UserContext);
  return (
    <>
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar.Image
            size={30}
            source={{ uri: userContext?.userInfo?.avatar_url }}
            style={{ marginRight: 15, }}
          />
          <Text style={styles.name}>{userContext?.userInfo?.first_name}'s Feed</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Appbar.Action
            icon="plus"
            size={30}
            color={Colors.grey900}
            onPress={() => navigation.navigate("NewPostScreen")}
          />
          <Appbar.Action
            icon="menu"
            size={30}
            color={Colors.grey900}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </View>
    </>
  );
};

export default JoysAndConcernsHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: Dimensions.get("window").height * 0.14,
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  name: {
    fontFamily: primaryFont.semiBold,
    fontSize: 15,
  }
});
