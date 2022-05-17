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
  Platform,
  TouchableOpacity,
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
import PostDetailsHeader from "./PostDetailsHeader";
import { StatusBar } from "expo-status-bar";

let isInit = true;
const PostDetailsScreen = ({ navigation, route }) => {

  const { post } = route?.params;
  const formatDate = new Date(post?.created_at).toLocaleDateString("en-US");
  const [liveLikes, setLiveLikes] = useState(post?.likes);
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
    if (post?.user_id) {
      userContext.sendPushNotification(
        post?.user_id,
        "Someone Liked Your Post!",
        `${userContext.formatName} liked one of your posts!`,
        route.params?.id,
        "POST_LIKED"
      );
    }
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
      .match({ post_id: post?.id })
      .order("id", { ascending: true });
    if (data.length > 0) {
      setComments(data);
    }
    isInit = false;
    setLoadingComments(false);
  }, [post?.id]);

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
      console.log(payload.eventType);
      if (payload.eventType === "INSERT") {
        setComments((prevComments) => {
          const filtered = prevComments.filter(
            (prevComment) => prevComment.id !== payload.new.id
          );
          return [...filtered, payload.new];
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
    Keyboard.dismiss();
    setPostingComment(true);
    if (commentContent.trim().length) {
      const newComment = {
        content: commentContent,
        post_id: post?.id,
        user_id: userContext.userInfo.id,
        avatar_url: userContext?.userInfo?.avatar_url,
        author: `${userContext?.userInfo?.first_name} ${userContext?.userInfo?.last_name}`,
      };
      try {
        const { data, error } = await supabase.from('comments').insert(newComment);
        if(error) {
          console.log("Error adding comment:: ", error.message);
          return;
        }

        if (post?.user_id) {
          userContext.sendPushNotification(
            post?.user_id,
            "New Comment!",
            `${userContext.formatName} commented on your post!`,
            post?.id,
            "NEW_COMMENT"
          );
        }
        setCommentContent("");
      } catch (err) {
        setPostingComment(false);
      }
    } else {
      setCommentContent("");
    }

    setPostingComment(false);
  };

  const commentForm = (
    <>
      <View style={styles.commentContainer}>
        <TextInput
          editable={!postingComment}
          multiline={true}
          placeholderTextColor={Colors.grey400}
          placeholder="Add A Comment"
          style={styles.commentInput}
          value={commentContent}
          onChangeText={(text) => setCommentContent(text)}
          returnKeyType="default"
          onSubmitEditing={() => addCommentHandler()}
        />
        <Button
          style={{ marginLeft: 2 }}
          loading={postingComment}
          onPress={addCommentHandler}
          disabled={postingComment}
          color={userColors.seaFoam600}
        >
          Post
        </Button>
      </View>
    </>
  );

  const signInToCommentForm = (
    <>
      <TouchableOpacity onPress={() => navigation.replace("AuthStack")}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={{ color: Colors.grey500, fontWeight: "600" }}>
            Sign In/Sign Up To Comment
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );

  const joyLabel = (
    <View
      style={{
        backgroundColor: Colors.teal600,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 25,
      }}
    >
      <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
        Joy
      </Text>
    </View>
  );

  const concernLabel = (
    <View
      style={{
        backgroundColor: Colors.indigo700,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 25,
      }}
    >
      <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
        Concern
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar style={Platform.OS === "android" ? "dark" : "light"} />
      <PostDetailsHeader
        post={post}
      />
      <SafeAreaView style={{ marginBottom: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView scrollEventThrottle={16}>
            <View style={styles.postContent}>
              <Text>{post?.postcontent}</Text>
            </View>
            <View style={styles.likesContainer}>
              <View>
                {post?.posttype === "joy" ? joyLabel : concernLabel}
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

            {userContext.userInfo ? commentForm : signInToCommentForm}

            <View style={{ height: Dimensions.get("window").height }}>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                />
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  commentContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.grey300,
    borderRadius: 10,
    padding: 4,
  },
});
