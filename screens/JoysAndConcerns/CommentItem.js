import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import useGetUser from "../../hooks/useGetUser";
import * as Animatable from "react-native-animatable";
import { Avatar, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import { primaryFont } from "../../constants/fonts";
import Card from "../../components/ui/Card";
const CommentItem = ({ author, content, postDate, user_id, id }) => {
  const formatDate = new Date(postDate).toLocaleDateString("en-US");

  const { user, avatarURL, loadingUser } = useGetUser(user_id);

  let formatName;
  if (user_id && user && !loadingUser) {
    formatName = `${user.first_name} ${user.last_name}`;
  } else {
    formatName = author;
  }

  const imageComponent = avatarURL ? (
    <Avatar.Image
      source={{ uri: avatarURL }}
      size={50}
      style={{ backgroundColor: userColors.seaFoam300 }}
    />
  ) : (
    <Avatar.Image
      source={require("../../assets/default-2.png")}
      size={50}
      style={{ backgroundColor: Colors.white }}
    />
  );

  return (
    <Animatable.View animation="fadeIn" style={{ borderBottomWidth: 1, borderColor: Colors.grey400 }}>
      <View style={{ marginHorizontal: 5}}>
        <View style={styles.headerSection}>
          <View style={styles.userInfoContainer}>
            {imageComponent}
            <View style={{ marginHorizontal: 10 }}>
              <Text style={styles.userName}>{formatName}</Text>
              <View style={styles.postContent}>
                <Text>{content}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animatable.View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "90%",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10,
  },
  userName: {
    fontFamily: primaryFont.bold,
    color: Colors.grey600
  },
  date: {
    fontFamily: primaryFont.regular,
    color: userColors.seaFoam400,
    letterSpacing: 0.5,
  },
  postContent: {
    fontFamily: primaryFont.regular,
    
  },
  likesContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
