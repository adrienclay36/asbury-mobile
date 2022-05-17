import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { BlogContext } from "../../store/BlogProvider";
import DrawerHeader from "../../components/ui/DrawerHeader";
import LottieView from "lottie-react-native";
import BlogItem from "./BlogItem";

const BlogHomeScreen = ({ navigation, route }) => {
  const blogContext = useContext(BlogContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      blogContext.setBadgeCount(0);
    });
    return unsubscribe;
  }, [navigation]);

  if (blogContext.loading) {
    return (
      <LottieView
        source={require("../../loaders/dotloader.json")}
        autoPlay
        loop
      />
    );
  }
  return (
  
    <>
    <DrawerHeader/>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshing={blogContext.loading}
        refreshControl={
          <RefreshControl onRefresh={() => blogContext.getPosts()} />
        }
        data={blogContext.posts}
        renderItem={(itemData) => (
          <BlogItem
            post={itemData?.item}
          />
          )}
          />
          </>
  
  );
};

export default BlogHomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight + 20,
  },
});
