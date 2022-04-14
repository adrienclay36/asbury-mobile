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
  TouchableOpacity
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
  const { ITEM_SIZE, avatarURL, formatDate, formatName, id, postType, userID } =
    route?.params;
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
    if(route.params?.userID){
      userContext.sendPushNotification(
        route.params?.userID,
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
      .match({ postid: route.params?.id })
      .order("id", { ascending: true });
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
    if (commentContent) {
      const newComment = {
        commentcontent: commentContent,
        postid: route.params?.id,
        postdate: new Date(),
        user_id: userContext.userValue.id,
      };
      try {
        const { data, error } = await addItemToTable("comments", newComment);

        if(route.params.userID){

          userContext.sendPushNotification(
            route.params?.userID,
            "New Comment!",
            `${userContext.formatName} commented on your post!`,
            route.params?.id,
            "NEW_COMMENT"
          );
        }
        setCommentContent("");
      } catch (err) {
        setPostingComment(false);
      }
    }

    setPostingComment(false);
  };

  const commentForm = (
    <>
      <KeyboardAvoidingView style={styles.commentContainer}>
        <TextInput
          editable={!postingComment}
          multiline={true}
          placeholderTextColor={Colors.grey400}
          placeholder="Add A Comment"
          style={styles.commentInput}
          value={commentContent}
          onChangeText={(text) => setCommentContent(text)}
        />
        <Button
          
          style={{ marginLeft: 2,}}
          loading={postingComment}
          onPress={addCommentHandler}
          disabled={postingComment}
          color={userColors.seaFoam600}
        >
          Post
        </Button>
      </KeyboardAvoidingView>
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
        userID={userID}
        liveLikes={liveLikes}
        formatName={formatName}
        avatarURL={avatarURL}
        formatDate={formatDate}
        postID={route.params?.id}
        postContent={route.params?.postContent}
        postType={route.params?.postType}
      />
      <SafeAreaView style={{ marginBottom: 30 }}>
        <ScrollView
          onScroll={() => Keyboard.dismiss()}
          scrollEventThrottle={16}
        >
          <View style={styles.postContent}>
            <Text>{route.params?.postContent}</Text>
          </View>
          <View style={styles.likesContainer}>
            <View>
              {route.params?.postType === "joy" ? (
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

          {userContext.userInfo ? commentForm : signInToCommentForm}

          <View style={{ height: Dimensions.get("window").height }}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                user_id={comment.user_id}
                content={comment.commentcontent}
                author={comment.author}
                postDate={comment.postdate}
                id={comment.id}
              />
            ))}
          </View>
        </ScrollView>
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
