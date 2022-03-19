import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useContext } from "react";
import CustomTextInput from "../../components/ui/CustomTextInput";
import { PrayerContext } from "../../store/PrayersProvider";
import { UserContext } from "../../store/UserProvider";
import { Button, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";

const NewPostScreen = ({ navigation, route }) => {
    const prayerContext = useContext(PrayerContext);
    const userContext = useContext(UserContext);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState('joy');
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const submitPostHandler = async () => {
    if(userContext.auth && postType && content) {
      prayerContext.addUserPost(postType, content, userContext.userValue.id, navigation);
      Keyboard.dismiss();
      return;
    }
      if(name && content) {
          prayerContext.addPost(name, postType, content, navigation);
          Keyboard.dismiss();
          return;
      }
      setError(true);
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={{ margin: 20, padding: 10 }}>
        <TextInput textAlignVertical='top' value={content} onChangeText={text => setContent(text)} multiline={true} placeholderTextColor={Colors.grey500} placeholder="posts are limited to 1000 characters" style={styles.textInput}/>
        <Picker
          onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}
          selectedValue={postType}
        >
          <Picker.Item label="Joy" value="joy" />
          <Picker.Item label="Concern" value="concern" />
        </Picker>
        {!userContext.auth && <CustomTextInput
          multiline={false}
          mode="flat"
          value={name}
          setValue={setName}
          style={{ margin: 10 }}
          label="Enter a display name"
        />}

        <Button
            onPress={submitPostHandler}
            disabled={prayerContext.posting}
            loading={prayerContext.posting}
          icon="message-plus"
          mode="contained"
          color={userColors.seaFoam600}
        >
          Post
        </Button>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default NewPostScreen;

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey300,
    height: Dimensions.get('window').width * .3,
    borderRadius: 5,
  }
});
