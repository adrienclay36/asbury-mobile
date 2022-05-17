import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useContext } from "react";
import CustomTextInput from "../../components/ui/CustomTextInput";
import { PrayerContext } from "../../store/PrayersProvider";
import { UserContext } from "../../store/UserProvider";
import { Button, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import { StatusBar } from "expo-status-bar";
import EditPostHeader from './EditPostHeader';
import CenteredLoader from "../../components/ui/CenteredLoader";
const EditPostScreen = ({ navigation, route }) => {
    const { post } = route?.params;
    console.log(postType);
  const prayerContext = useContext(PrayerContext);
  const userContext = useContext(UserContext);
  const [content, setContent] = useState(post?.postcontent);
  const [postType, setPostType] = useState(post?.posttype);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  
  

  const editPostHandler = async () => {
    if (userContext.auth && postType && content) {
      prayerContext.editPost(post?.id, content, postType, navigation);
    //   navigation.navigate("PostDetails", {liveLikes, userID, postContent, postType, id: postID, formatName, formatDate, avatarURL, userID})
      Keyboard.dismiss();
      navigation.popToTop();
      return;
    }
    if (name && content) {
      prayerContext.editPost(name, postType, content, navigation);
      Keyboard.dismiss();
      return;
    }
    setError(true);
  };

  if (prayerContext.posting) {
    return (
      <>
        <EditPostHeader
          navigation={navigation}
          editPostHandler={editPostHandler}
        />

        <CenteredLoader />
      </>
    );
  }
  return (
    <>
      <EditPostHeader
        navigation={navigation}
        editPostHandler={editPostHandler}
      />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={{ margin: 20, padding: 10 }}>
          <StatusBar style={Platform.OS === "android" ? "dark" : "light"} />
          <TextInput
            textAlignVertical="top"
            value={content}
            onChangeText={(text) => setContent(text)}
            multiline={true}
            placeholderTextColor={Colors.grey500}
            placeholder="what would you like to say?"
            style={styles.textInput}
          />
          <Picker
            onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}
            selectedValue={postType}
          >
            <Picker.Item label="Joy" value="joy" />
            <Picker.Item label="Concern" value="concern" />
          </Picker>
          {!userContext.auth && (
            <CustomTextInput
              multiline={false}
              mode="flat"
              value={name}
              setValue={setName}
              style={{ margin: 10 }}
              label="Enter a display name"
            />
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default EditPostScreen;

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey300,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: 5,
  },
});
