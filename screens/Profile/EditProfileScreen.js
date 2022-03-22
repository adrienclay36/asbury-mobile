import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../store/UserProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, Colors, TouchableRipple } from "react-native-paper";
import EditProfileScreenHeader from "./EditProfileScreenHeader";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../supabase-service";
import { updateItemInTable } from "../../supabase-util";
import { decode } from "base64-arraybuffer";
import { userColors } from "../../constants/userColors";
const IMAGE_SIZE = 100;
const EditProfileScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const [firstName, setFirstName] = useState(userContext.userInfo?.first_name);
  const [lastName, setLastName] = useState(userContext.userInfo?.last_name);
  const [location, setLocation] = useState(userContext.userInfo?.location);
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (image) => {
    setUploading(true);
    const base64Data = image.base64;
    const ext = image.uri.substring(image.uri.lastIndexOf(".") + 1);
    const fileName = `${new Date().getTime().toString()}_avatar.${ext}`;
    const newAvatarPath = `${userContext.userValue.id}/${fileName}`;
    const uploadUri =
      Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri;
    const formData = new FormData();
    formData.append("files", {
      uri: uploadUri,
      fileName,
      type: `image/${ext}`,
    });

    if (userContext.userInfo.avatar_url !== "default-2.png") {
      try {
        const { data: removePhotoData, error: removePhotoError } =
          await supabase.storage
            .from("avatars")
            .remove([userContext.userInfo.avatar_url]);
        if (removePhotoError) {
          console.log("Photo Removal Error::", removePhotoError);
        }
      } catch (err) {
        console.log("EditProfileScreen: error:: ", err.message);
      }
    }

    try {
      console.log(newAvatarPath);
      const { data: photoUploadData, error: photoUploadError } =
        await supabase.storage
          .from("avatars")
          .upload(newAvatarPath, decode(base64Data), {
            contentType: `image/${ext}`,
          });
      if (photoUploadError) {
        console.log("Photo Upload Error::", photoUploadError);
      }
      const response = await updateItemInTable(
        "users",
        userContext.userInfo.id,
        { avatar_url: newAvatarPath }
      );
    } catch (error) {
      console.log("Photo upload error:: ", error.message);
    }

    userContext.checkUser();
    setUploading(false);
  };

  const accessMediaLibrary = async () => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions.granted) {
      const fetchedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        allowsMultipleSelection: false,
        base64: true,
      });
      if (!fetchedImage.cancelled) {
        uploadPhoto(fetchedImage);
      } else {
        return;
      }
    } else {
      Alert.alert(
        "Can't take photo",
        "You must allow camera access to take a photo",
        [
          {
            text: "Go To Settings",
            onPress: () => Linking.openURL("app-settings:"),
          },
          { text: "Cancel" },
        ]
      );
    }
  };

  const accessCamera = async () => {
    const permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions.granted) {
      const fetchedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        allowsMultipleSelection: false,
        base64: true,
      });
      if (!fetchedImage.cancelled) {
        uploadPhoto(fetchedImage);
      } else {
        return;
      }
    } else {
      Alert.alert(
        "Can't take photo",
        "You must allow camera access to take a photo",
        [
          {
            text: "Go To Settings",
            onPress: () => Linking.openURL("app-settings:"),
          },
          { text: "Cancel" },
        ]
      );
    }
  };

  const takePhoto = async () => {
    Alert.alert("Upload Photo", "", [
      { text: "Take Photo", onPress: () => accessCamera() },
      { text: "Choose Photo", onPress: () => accessMediaLibrary() },
      { text: "Cancel" },
    ]);
  };

  return (
    <>
      <EditProfileScreenHeader navigation={navigation} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View style={{ alignItems: "center", overflow: "hidden" }}>
            <TouchableRipple style={styles.container} onPress={takePhoto}>
              {uploading ? (
                <ActivityIndicator
                  size="large"
                  color={userColors.seaFoam600}
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <ImageBackground
                  style={styles.backgroundImage}
                  imageStyle={{ borderRadius: IMAGE_SIZE / 2 }}
                  source={{
                    uri:
                      userContext?.avatarURL ||
                      require("../../assets/default-2.png"),
                  }}
                >
                  <View style={styles.editImageContainer}>
                    <Icon
                      name="camera"
                      size={30}
                      color={Colors.white}
                      style={styles.cameraIcon}
                    />
                  </View>
                </ImageBackground>
              )}
            </TouchableRipple>
          </View>

          <View style={styles.editContainer}>
            <View style={styles.rowNoBottom}>
              <Icon
                style={{ marginRight: 15 }}
                color={Colors.grey600}
                name="account-circle"
                size={30}
              />
              <TextInput
                placeholder="First Name"
                style={styles.textInput}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>

            <View style={styles.rowNoBottom}>
              <Icon
                style={{ marginRight: 15 }}
                color={Colors.grey600}
                name="account-circle-outline"
                size={30}
              />
              <TextInput
                placeholder="Last Name"
                style={styles.textInput}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>

            <View style={styles.row}>
              <Icon
                style={{ marginRight: 15 }}
                color={Colors.grey600}
                name="map-marker"
                size={30}
              />
              <TextInput
                placeholder="Last Name"
                style={styles.textInput}
                value={location}
                onChangeText={(text) => setLocation(text)}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 30,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: "hidden",
  },
  backgroundImage: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  editImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    opacity: 0.7,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 10,
  },
  editContainer: {
    marginTop: 50,
  },
  row: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.grey300,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  rowNoBottom: {
    borderTopWidth: 1,
    borderColor: Colors.grey300,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
  },
});
