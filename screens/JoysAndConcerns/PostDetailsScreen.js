import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Avatar, Button, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import { primaryFont } from "../../constants/fonts";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../supabase-service";
import CommentItem from "./CommentItem";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { addItemToTable } from "../../supabase-util";

let isInit = true;
const PostDetailsScreen = ({ navigation, route }) => {
  const [liveLikes, setLiveLikes] = useState(route.params?.liveLikes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [payload, setPayload] = useState();
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const prayerContext = useContext(PrayerContext);
  const userContext = useContext(UserContext);

  const incrementLikeHandler = async () => {
    const storedPost = await AsyncStorage.getItem(`post_${route.params?.id}`);
    if (storedPost) {
      prayerContext.decrementLike(route.params?.id);
      AsyncStorage.removeItem(`post_${route.params?.id}`);
      setLiveLikes(liveLikes - 1);
      return;
    }
    setLiveLikes(liveLikes + 1);
    prayerContext.incrementLike(route.params?.id);
    AsyncStorage.setItem(`post_${route.params?.id}`, "1");
    userContext.sendPushNotification(
      route.params?.userID,
      "Someone Liked Your Post!",
      `${userContext.formatName} liked one of your posts!`,
      route.params?.id,
      "POST_LIKED"
    );
  };

  const getLikeStatus = async () => {
    const storedPost = await AsyncStorage.getItem(`post_${route.params?.id}`);
    if (storedPost) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    isInit = false;
  };
  useEffect(() => {
    getLikeStatus();
  }, [liveLikes]);


  const getComments = useCallback(async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from("comments")
      .select()
      .match({ postid: route.params?.id })
      .order("id", { ascending: false });
    if (data.length > 0) {
      setComments(data);
    }
    isInit = false;
    setLoadingComments(false);
  }, [route.params?.id]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    const commentSub = supabase
      .from("comments")
      .on("*", (payloadItem) => setPayload(payloadItem))
      .subscribe();
    return () => supabase.removeSubscription(commentSub);
  }, []);

  useEffect(() => {
    if (payload) {
      if (payload.eventType === "INSERT") {
        setComments((prevComments) => {
          const filtered = prevComments.filter(
            (prevComment) => prevComment.id !== payload.new.id
          );
          return [payload.new, ...filtered];
        });
      }

      if (payload.eventType === "DELETE") {
        setComments((prevComments) => {
          const filtered = prevComments.filter(
            (comment) => comment.id !== payload.old.id
          );
          return filtered;
        });
      }
    }

    return () => setPayload(null);
  }, [payload]);

  const addCommentHandler = async () => {
    setPostingComment(true)
    if (commentContent) {
      const newComment = {
        commentcontent: commentContent,
        postid: route.params?.id,
        postdate: new Date(),
        user_id: userContext.userValue.id,
      };
      try {

        const { data, error } = await addItemToTable("comments", newComment);
        userContext.sendPushNotification(
          route.params?.userID,
          "New Comment!",
          `${userContext.formatName} commented on your post!`,
          route.params?.id,
          "NEW_COMMENT"
        );
        setCommentContent('');
      } catch (err) {
        setPostingComment(false);
      }
    } 

    setPostingComment(false);

  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ marginBottom: 30 }}>
        <ScrollView>
          <View style={styles.postContent}>
            <Text>{route.params?.postContent}</Text>
          </View>
          <View style={styles.likesContainer}>
            <View>
              {route.params?.postType === "joy" ? (
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

          <KeyboardAvoidingView style={styles.commentContainer}>
            <TextInput
              numberOfLines={5}
              multiline={true}
              placeholderTextColor={Colors.grey400}
              placeholder="Add A Comment"
              style={styles.commentInput}
              value={commentContent}
              onChangeText={(text) => setCommentContent(text)}
            />
            <Button loading={postingComment} onPress={addCommentHandler} disabled={postingComment} color={userColors.seaFoam600}>
              Post
            </Button>
          </KeyboardAvoidingView>

          <View style={{ height: Dimensions.get("window").height }}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                user_id={comment.user_id}
                content={comment.commentcontent}
                author={comment.author}
                postDate={comment.postdate}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
  postContent: {
    paddingTop: 25,
    paddingHorizontal: 30,
    fontFamily: primaryFont.regular,
  },
  likesContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",

    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.grey300,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  commentInput: {
    flex: 1,
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.grey300,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  commentContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
