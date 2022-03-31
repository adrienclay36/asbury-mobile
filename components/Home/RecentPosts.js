import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useContext, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostItem from "../../screens/JoysAndConcerns/PostItem";
import { PrayerContext } from "../../store/PrayersProvider";
const { width, height } = Dimensions.get("window");
import Carousel from "react-native-snap-carousel";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
const RecentPosts = ({ navigation, route }) => {
  const prayerContext = useContext(PrayerContext);
  const isCarousel = useRef(null);

  const renderPostItem = (itemData) => {
    return (
      <PostItem
        itemHeight={true}
        postContent={itemData.item.postcontent}
        author={itemData.item.author}
        postDate={itemData.item.postdate}
        userID={itemData.item.user_id}
        postType={itemData.item.posttype}
        likes={itemData.item.likes}
        index={itemData.index}
        id={itemData.item.id}
        navigation={navigation}
        fromHomePage={true}
      />
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Recent Posts</Text>
          <Ionicons
            name="chatbubble-ellipses-outline"
            color={userColors.seaFoam600}
            style={{ marginLeft: 10 }}
            size={30}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("JoysStack")}>
            <Text>View Board &rarr;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Carousel
        ref={isCarousel}
        data={prayerContext.posts.slice(0, 3)}
        renderItem={renderPostItem}
        sliderWidth={Dimensions.get("window").width}
        itemWidth={width - 25}
        layout="stack"
        loop={false}
      />
    </>
  );
};

export default RecentPosts;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
  },
  header: {
    fontSize: 25,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
