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
const BlogHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);

  const formatTitle = route.params?.title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace("---", "-")
    .toLowerCase();

  const shareURL = `${BASE_URL}/${route.params?.id}/${formatTitle}`;
  const shareMessage = `Check out this post by ${route.params?.author} on Asbury UMC!`;

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      size={IMAGE_SIZE}
      source={{ uri: userContext.avatarURL }}
      style={styles.image}
    />
  ) : (
    <Avatar.Image
      size={IMAGE_SIZE}
      source={require("../../assets/default-2.png")}
      style={styles.image}
    />
  );

  return (
    <>
      <SafeAreaView
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          },
        ]}
      >
        {/* <Text style={styles.title}>Announcements</Text> */}

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

export default BlogHeader;

const styles = StyleSheet.create({
  header: {
    marginTop: StatusBar.currentHeight,
    marginHorizontal: 10,
    marginBottom: -40,
  },
  title: {
    marginLeft: 20,
    shadowOpacity: 0,
    fontSize: 25,
    fontFamily: primaryFont.extraBold,
  },
});
