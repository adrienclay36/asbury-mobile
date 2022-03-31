import { StyleSheet, Text, View, FlatList, SafeAreaView, StatusBar, RefreshControl } from "react-native";
import React, { useContext, useEffect } from "react";
import { BlogContext } from "../../store/BlogProvider";

import LottieView from 'lottie-react-native';
import BlogItem from "./BlogItem";

const BlogHomeScreen = ({ navigation, route }) => {
  const blogContext = useContext(BlogContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      blogContext.setBadgeCount(0);
    });
    return unsubscribe;
  }, [navigation]);

  if(blogContext.loading) {
    return <LottieView source={require("../../loaders/dotloader.json")} autoPlay loop />
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
        refreshing={blogContext.loading}
        refreshControl={<RefreshControl onRefresh={() => blogContext.getPosts()} />}
        data={blogContext.posts}
        renderItem={(itemData) => <BlogItem id={itemData.item.id} navigation={navigation} route={route} image={itemData.item.image} title={itemData.item.title} author={itemData.item.author} postContent={itemData.item.postcontent} postDate={itemData.item.postdate} userID={itemData.item?.user_id} />}
      />
    </SafeAreaView>
  );
};

export default BlogHomeScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight + 20,
        
    }
});
