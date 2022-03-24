import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Card } from "react-native-paper";
import useGetUser from "../../hooks/useGetUser";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { onShare } from "../../helpers/onShare";
import * as Animatable from "react-native-animatable";
const BASE_URL = `https://asbury-next-website.vercel.app/blog`;
const BlogItem = ({
  title,
  author,
  image,
  postDate,
  postContent,
  userID,
  navigation,
  route,
  id,
}) => {
  const { width, height } = useWindowDimensions();

  const { user, avatarURL, loadingUser } = useGetUser(userID);

  

  if (loadingUser || !user) {
    return null;
  }
  let rightContent;
  if (avatarURL) {
    rightContent = (props) => (
      <Avatar.Image
        {...props}
        style={styles.avatar}
        source={{ uri: avatarURL }}
      />
    );
  } else {
    rightContent = (props) => (
      <Avatar.Image
        {...props}
        style={styles.avatar}
        source={require("../../assets/default-2.png")}
      />
    );
  }

  const source = { html: postContent };
  const formatTitle = title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace("---", "-")
    .toLowerCase();

  let imageComponent;
  if (image.includes("http")) {
    imageComponent = <Card.Cover source={{ uri: image }} />;
  } else {
    imageComponent = (
      <Card.Cover source={require("../../assets/blog-default.png")} />
    );
  }

  const shareMessage = `Check out this post by ${author} on Asbury UMC!`;
  const shareURL = `${BASE_URL}/${id}/${formatTitle}`;

  return (
    <TouchableOpacity
      onLongPress={() => onShare(shareMessage, shareURL)}
      onPress={() =>
        navigation.navigate("BlogDetailsScreen", {
          id,
          title,
          author: `${user.first_name} ${user.last_name}`,
          image,
          postDate,
          postContent,
          userID,
          avatarURL,
        })
      }
    >
      <Animatable.View animation="fadeIn">
        <Card style={styles.card}>
          {imageComponent}
          <Card.Title title={title} subtitle={`${user.first_name} ${user.last_name}`} right={rightContent} />
          <RenderHTML baseStyle={{ marginHorizontal: 20, textAlign: 'left'}} source={{ html: postContent.length > 100 ? postContent.slice(0, 100) + "..." : postContent }} contentWidth={width} />
        </Card>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default React.memo(BlogItem);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  avatar: {
    marginRight: 20,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
});
