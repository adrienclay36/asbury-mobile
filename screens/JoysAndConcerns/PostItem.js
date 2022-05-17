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
  post,
  navigation,
  fromHomePage,
  itemHeight,
}) => {
  const [liveLikes, setLiveLikes] = useState(post?.likes);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const userContext = useContext(UserContext);
  const getLikeStatus = useCallback(async () => {
    const storedPost = await AsyncStorage.getItem(`post_${post?.id}`);
    if (storedPost) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    isInit = false;
  }, [post?.id]);

  const getCommentCount = useCallback(async () => {
    const { data, count } = await supabase
      .from("comments")
      .select("postid", { count: "exact" })
      .match({ postid: post?.id });
    setCommentCount(count);
  }, [post?.id]);

  useEffect(() => {
    getLikeStatus();
    getCommentCount();
  }, [liveLikes]);

  const prayerContext = useContext(PrayerContext);



  const formatDate = new Date(post?.created_at).toLocaleDateString("en-US");


  

  const imageComponent =  (
    <Avatar.Image
      source={{ uri: post?.avatar_url }}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  )
 

  const incrementLikeHandler = async () => {
    const storedPost = await AsyncStorage.getItem(`post_${post?.id}`);
    if (storedPost) {
      prayerContext.decrementLike(post?.id);
      AsyncStorage.removeItem(`post_${post?.id}`);
      setLiveLikes(liveLikes - 1);
      return;
    }
    setLiveLikes(liveLikes + 1);
    prayerContext.incrementLike(post?.id);
    if (post?.user_id) {
      userContext.sendPushNotification(
        post?.user_id,
        "Someone Liked Your Post!",
        `${userContext.formatName} Liked one of your posts!`,
        post?.id,
        "POST_LIKED"
      );
    }
    AsyncStorage.setItem(`post_${post?.id}`, "1");
  };

  const navigatePostDetails = () => {
    navigation.navigate("PostDetails", { post });
  };

  const navigateJoysHome = () => {
    navigation.navigate("JoysStack");
    setTimeout(() => {
      navigation.navigate("PostDetails", { post });
    }, 250);
  };

  const joyLabel = (
    <View style={{
      backgroundColor: Colors.teal600,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 25,
    }}>
      <Text style={{  color: 'white', fontWeight: '600', fontSize: 12}}>Joy</Text>
    </View>
  )

  const concernLabel = (
    <View
      style={{
        backgroundColor: Colors.indigo700,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 25,
      }}
    >
      <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>Concern</Text>
    </View>
  );

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
                    <Text style={styles.userName}>{post?.author}</Text>
                    <Text style={styles.date}>{formatDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.content}>
                <Text>
                  {post?.postcontent?.length > 100
                    ? post?.postcontent.slice(0, 100) + "..."
                    : post?.postcontent}
                </Text>
              </View>
            </View>
            <View style={styles.likesContainer}>
              <Text style={styles.commentCount}>{post?.comment_count} comments</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginRight: 10 }}>
                  {post?.posttype === "joy" ? (
                    joyLabel
                  ) : (
                    concernLabel
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
