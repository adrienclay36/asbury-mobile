import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";
import { useNavigation } from "@react-navigation/native";
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT =
  Platform.OS === "android" ? height * 0.13 : height * 0.109;
const PostDetailsHeader = ({ post }) => {
  const userContext = useContext(UserContext);
  const prayerContext = useContext(PrayerContext);
  const navigation = useNavigation();

  const headerComponent = <Text style={styles.headerText}>{post?.author}</Text>;

  const imageComponent = (
    <Avatar.Image
      style={styles.avatar}
      size={AVATAR_SIZE}
      source={{ uri: post?.avatar_url }}
    />
  );

  const deletePostHandler = async () => {
    Alert.alert(
      "Delete Post?",
      "Are you sure you want to delete this post? This action cannot be undone",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePostConfirmed(),
        },
        { text: "Cancel" },
      ]
    );
  };

  const deletePostConfirmed = () => {
    prayerContext.deletePost(post?.id);
    navigation.popToTop();
  };
  return (
    <>
      <View style={styles.header}>
        <View style={styles.contentContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Platform.OS === "android" && (
              <Appbar.BackAction
                onPress={() => navigation.goBack()}
                color={Colors.white}
              />
            )}
            {imageComponent}
            {headerComponent}
          </View>
          {userContext.userValue?.id === post?.user_id && (
            <View style={{ flexDirection: "row" }}>
              <Appbar.Action
                icon="pencil"
                color={
                  Platform.OS === "android" ? Colors.white : Colors.grey700
                }
                onPress={() =>
                  navigation.navigate("EditPostScreen", {
                    post,
                  })
                }
              />
              <Appbar.Action
                icon="trash-can"
                color={Platform.OS === "android" ? Colors.white : Colors.red700}
                onPress={deletePostHandler}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default PostDetailsHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : Colors.grey200,
    height: HEADER_HEIGHT,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: HEADER_HEIGHT / 6,
    // marginHorizontal: 20,
  },
  userContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: "transparent",
    marginLeft: 20,
  },
  headerText: {
    color: Platform.OS === "android" ? Colors.white : Colors.black,
    fontFamily: primaryFont.semiBold,
    marginLeft: 10,
    fontSize: 20,
  },
  leftContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
