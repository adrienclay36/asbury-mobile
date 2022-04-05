import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import { PrayerContext } from "../../store/PrayersProvider";
import PostItem from "./PostItem";
import LottieView from 'lottie-react-native'
const JoysAndConcernsHomeScreen = ({ navigation, route }) => {
  const prayerContext = useContext(PrayerContext);
  const [calledDuringMomentum, setCalledDuringMomentum] = useState(true);
  let scrollY = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      prayerContext.setBadgeCount(0);
    });
    return unsubscribe;
  }, [navigation]);



  const renderPostItem = (itemData) => {
    return (
      <PostItem
        postContent={itemData.item.postcontent}
        author={itemData.item.author}
        postDate={itemData.item.postdate}
        userID={itemData.item.user_id}
        postType={itemData.item.posttype}
        likes={itemData.item.likes}
        scrollY={scrollY}
        index={itemData.index}
        id={itemData.item.id}
        navigation={navigation}
      />
    );
  };

  if (prayerContext.loading) {
    return <LottieView source={require("../../loaders/dotloader.json")} autoPlay loop />;
  }


  return (
    <SafeAreaView style={styles.container}>
    
      {prayerContext.posts && <FlatList
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0 || calledDuringMomentum) {
            return;
          }
          prayerContext.incrementPage();
        }}
        bounces={true}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => setCalledDuringMomentum(false)}
        refreshing={prayerContext.loading}
        refreshControl={
          <RefreshControl onRefresh={() => {
            setCalledDuringMomentum(true);
            prayerContext.refreshPosts()
          }} />
        }
        data={prayerContext.posts}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        initialNumToRender={10}
        keyExtractor={(item, index) => item.id}
        renderItem={(itemData) => renderPostItem(itemData)}
        style={{ height: Dimensions.get('window').height }}
        
      />}
      
     
    </SafeAreaView>
  );
};

export default JoysAndConcernsHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  }, 
  endOfList: {
    margin: 40,
    textAlign: 'center',
  }
});
