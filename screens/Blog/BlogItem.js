import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Card } from "react-native-paper";

import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { onShare } from "../../helpers/onShare";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
const BASE_URL = `https://asbury-next-website.vercel.app/blog`;
const BlogItem = ({ post }) => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const rightContent = (props) => (
    <Avatar.Image
      {...props}
      style={styles.avatar}
      source={{ uri: post?.avatar_url }}
    />
  );

  const source = { html: post?.postcontent };
  const formatTitle = post?.title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace("---", "-")
    .toLowerCase();

  let imageComponent;
  if (post?.image.includes("http")) {
    imageComponent = <Card.Cover source={{ uri: post?.image }} />;
  } else {
    imageComponent = (
      <Card.Cover source={require("../../assets/blog-default.png")} />
    );
  }

  const shareMessage = `Check out this post by ${post?.author} on Asbury UMC!`;
  const shareURL = `${BASE_URL}/${post?.id}/${formatTitle}`;

  return (
    <TouchableOpacity
      onLongPress={() => onShare(shareMessage, shareURL)}
      onPress={() =>
        navigation.navigate("BlogDetailsScreen", {
          post,
        })
      }
    >
      <Animatable.View animation="fadeIn">
        <Card style={styles.card}>
          {imageComponent}
          <Card.Title
            titleStyle={{ color: "black" }}
            subtitleStyle={{ color: "black" }}
            title={post?.title}
            subtitle={post?.author}
            right={rightContent}
          />
          <RenderHTML
            baseStyle={{ marginHorizontal: 20, textAlign: "left" }}
            source={{
              html:
                post?.postcontent.length > 100
                  ? post.postcontent.slice(0, 100) + "..."
                  : post?.postcontent,
            }}
            contentWidth={width}
          />
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
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  avatar: {
    marginRight: 20,
    marginLeft: 10,
    backgroundColor: "transparent",
  },
});
