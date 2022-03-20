import { Dimensions, StyleSheet, Text, View, Share } from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { UserContext } from "../../store/UserProvider";
import { onShare } from "../../helpers/onShare";
const BASE_URL = `https://asbury-next-website.vercel.app/blog`;

const BlogDetailsHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);
  

  const formatTitle = route.params?.title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace("---", "-")
    .toLowerCase();
    

  const shareURL = `${BASE_URL}/${route.params?.id}/${formatTitle}`
    const shareMessage = `Check out this post by ${route.params?.author} on Asbury UMC!`

  

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: "transparent",
          justifyContent: "space-between",
          alignItems: "center",
          shadowOpacity: 0,
        }}
      >
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={route.params?.author} />
        <Appbar.Action
          icon="share"
          onPress={() =>
            onShare(shareMessage, shareURL)
          }
        />
      </Appbar.Header>
    </>
  );
};

export default BlogDetailsHeader;

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
    margin: 20,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
});
