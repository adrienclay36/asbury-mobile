import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../../components/ui/Card";
import useGetUser from "../../hooks/useGetUser";
import { Avatar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { userColors } from "../../constants/userColors";
import Ionicons from "react-native-vector-icons/Ionicons";
const { height: wHeight } = Dimensions.get("window");
import { PrayerContext } from "../../store/PrayersProvider";
import { supabase } from "../../supabase-service";
import { UserContext } from "../../store/UserProvider";
import * as Animatable from "react-native-animatable";
let isInit = true;
const height = wHeight - 200;
const ITEM_SIZE = 225;
const MARGIN = 10;
const CARD_HEIGHT = ITEM_SIZE + MARGIN * 2;
const PostItem = ({
  author,
  likes,
  id,
  postContent,
  postDate,
  postType,
  userID,
  scrollY,
  index,
  navigation,
  fromHomePage,
  itemHeight,
}) => {
  const [liveLikes, setLiveLikes] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const userContext = useContext(UserContext);

  const getLikeStatus = useCallback(async () => {
    const storedPost = await AsyncStorage.getItem(`post_${id}`);
    if (storedPost) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    isInit = false;
  }, [id]);

  const getCommentCount = useCallback(async () => {
    const { data, count } = await supabase
      .from("comments")
      .select("postid", { count: "exact" })
      .match({ postid: id });
    setCommentCount(count);
  }, [id]);

  useEffect(() => {
    getLikeStatus();
    getCommentCount();
  }, [liveLikes]);

  const prayerContext = useContext(PrayerContext);

  const { user, avatarURL, loadingUser } = useGetUser(userID);

  const formatDate = new Date(postDate).toLocaleDateString("en-US");

  if (loadingUser) {
    return null;
  }

  let formatName;
  if (user) {
    formatName = `${user.first_name} ${user.last_name}`;
  } else {
    formatName = author;
  }

  const imageComponent = avatarURL ? (
    <Avatar.Image
      source={{ uri: avatarURL }}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  ) : (
    <Avatar.Image
      source={require("../../assets/default-2.png")}
      size={50}
      style={{ backgroundColor: Colors.white }}
    />
  );

  const incrementLikeHandler = async () => {
    const storedPost = await AsyncStorage.getItem(`post_${id}`);
    if (storedPost) {
      prayerContext.decrementLike(id);
      AsyncStorage.removeItem(`post_${id}`);
      setLiveLikes(liveLikes - 1);
      return;
    }
    setLiveLikes(liveLikes + 1);
    prayerContext.incrementLike(id);
    if (userID) {
      userContext.sendPushNotification(
        userID,
        "Someone Liked Your Post!",
        `${userContext.formatName} Liked one of your posts!`,
        id,
        "POST_LIKED"
      );
    }
    AsyncStorage.setItem(`post_${id}`, "1");
  };

  const navigatePostDetails = () => {
    navigation.navigate("PostDetails", {
      liveLikes,
      formatName,
      postContent,
      formatDate,
      postType,
      id,
      userID,
      ITEM_SIZE,
      avatarURL,
    });
  };

  const navigateJoysHome = () => {
    navigation.navigate("JoysStack");
    setTimeout(() => {
      navigation.navigate("PostDetails", {
        liveLikes,
        formatName,
        postContent,
        formatDate,
        postType,
        id,
        userID,
        ITEM_SIZE,
        avatarURL,
      });
    }, 250);
  };

  return (
    <TouchableWithoutFeedback
      onPress={fromHomePage ? navigateJoysHome : navigatePostDetails}
    >
      <Animatable.View animation="fadeIn">
        <Card height={itemHeight ? ITEM_SIZE : null}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              height: itemHeight && ITEM_SIZE - 30,
            }}
          >
            <View>
              <View style={styles.headerSection}>
                <View style={styles.userInfoContainer}>
                  {imageComponent}
                  <View style={{ marginHorizontal: 10 }}>
                    <Text style={styles.userName}>{formatName}</Text>
                    <Text style={styles.date}>{formatDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.content}>
                <Text>
                  {postContent?.length > 100
                    ? postContent.slice(0, 100) + "..."
                    : postContent}
                </Text>
              </View>
            </View>
            <View style={styles.likesContainer}>
              <Text style={styles.commentCount}>{commentCount} comments</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginRight: 10 }}>
                  {postType === "joy" ? (
                    <Ionicons
                      name="ios-happy-outline"
                      color={Colors.green600}
                      size={25}
                    />
                  ) : (
                    <Ionicons
                      name="ios-sad-outline"
                      color={Colors.blue600}
                      size={25}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {liked ? (
                    <Ionicons
                      onPress={() => incrementLikeHandler()}
                      name="heart"
                      size={25}
                      color={Colors.red600}
                    />
                  ) : (
                    <Ionicons
                      onPress={() => incrementLikeHandler()}
                      color={Colors.red600}
                      name="heart-outline"
                      size={25}
                    />
                  )}
                  <Text style={{ marginLeft: 5 }}>{liveLikes}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontFamily: primaryFont.bold,
  },
  date: {
    fontFamily: primaryFont.regular,
    color: userColors.seaFoam400,
    letterSpacing: 0.5,
  },
  content: {
    paddingTop: 25,
    paddingHorizontal: 30,
    fontFamily: primaryFont.regular,
  },
  likesContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  commentCount: {
    fontFamily: primaryFont.light,
    color: userColors.seaFoam500,
  },
});
