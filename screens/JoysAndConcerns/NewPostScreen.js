import {
  StyleSheet,
  Text,
  View,
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
import NewPostHeader from "./NewPostHeader";
import CenteredLoader from "../../components/ui/CenteredLoader";
import { ScrollView } from "react-native-gesture-handler";
const NewPostScreen = ({ navigation, route }) => {
  const prayerContext = useContext(PrayerContext);
  const userContext = useContext(UserContext);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("joy");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const submitPostHandler = async () => {
    if (userContext.auth && postType && content) {
      prayerContext.addUserPost(
        postType,
        content,
        userContext.userValue.id,
        navigation
      );
      Keyboard.dismiss();
      return;
    }
    if (name && content) {
      prayerContext.addPost(name, postType, content, navigation);
      Keyboard.dismiss();
      return;
    }
    setError(true);
    prayerContext.setBadgeCount(0);
  };

  if (prayerContext.posting) {
    return (
      <>
        <NewPostHeader
          navigation={navigation}
          submitPostHandler={submitPostHandler}
        />

        <CenteredLoader />
      </>
    );
  }
  return (
    <>
      <NewPostHeader
        navigation={navigation}
        submitPostHandler={submitPostHandler}
      />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={{ margin: 20, padding: 10 }}>
          <ScrollView>
            <StatusBar style={Platform.OS === "android" ? "dark" : "light"} />
            {!userContext.auth && (
              <TextInput
                placeholder='Display Name'
                placeholderTextColor={Colors.grey400}
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.displayName}
              />
            )}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default NewPostScreen;

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey300,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: 5,
  },
  displayName: {
    borderBottomWidth: 1,
    borderColor: Colors.grey300,
    marginBottom: 10,
    padding: 10,
  },
});
