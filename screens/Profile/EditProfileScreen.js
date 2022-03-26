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
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";
const IMAGE_SIZE = 100;
const EditProfileScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const [firstName, setFirstName] = useState(userContext.userInfo?.first_name);
  const [lastName, setLastName] = useState(userContext.userInfo?.last_name);
  const [location, setLocation] = useState(userContext.userInfo?.location);
  const [saving, setSaving] = useState(false);

  const isDefaultPhoto =
    userContext.userInfo.avatar_url === "default-2.png"
      ? Colors.pink600
      : Colors.white;

  const [uploading, setUploading] = useState(false);
  const [valuesChanged, setValuesChanged] = useState({
    firstNameChanged: false,
    lastNameChanged: false,
    locationChanged: false,
  });
  const [data, setData] = useState({
    firstName: userContext.userInfo?.first_name,
    lastName: userContext.userInfo?.last_name,
    location: userContext.userInfo?.location,
    firstNameIsValid: true,
    lastNameIsValid: true,
    locationIsValid: true,
  });

  useEffect(() => {
    if (data.location.trim() === userContext.userInfo.location) {
      setValuesChanged({
        ...valuesChanged,
        locationChanged: false,
      });
    } else {
      setValuesChanged({
        ...valuesChanged,
        locationChanged: true,
      });
    }
  }, [data.location]);

  useEffect(() => {
    if (data.firstName.trim() === userContext.userInfo.first_name) {
      setValuesChanged({
        ...valuesChanged,
        firstNameChanged: false,
      });
    } else {
      setValuesChanged({
        ...valuesChanged,
        firstNameChanged: true,
      });
    }
  }, [data.firstName]);

  useEffect(() => {
    if (data.lastName.trim() === userContext.userInfo.last_name) {
      setValuesChanged({
        ...valuesChanged,
        lastNameChanged: false,
      });
    } else {
      setValuesChanged({
        ...valuesChanged,
        lastNameChanged: true,
      });
    }
  }, [data.lastName]);

  const newUserNotification = () => {
    setTimeout(() => {
      Toast.show({
        text1: "Add a Photo and Change Your Name!",
        text2: "Let your friends and family know you're here!",
        type: "info",
        position: "bottom",
        visibilityTime: 10000,
      });
    }, 1000);
  };

  useEffect(() => {
    if (userContext?.userInfo) {
      if (
        userContext.userInfo.first_name === "New" &&
        userContext.userInfo.last_name === "User"
      ) {
        newUserNotification();
      }
    }
  }, [userContext.userInfo]);

  const firstNameChangeHandler = (text) => {
    if (text.trim().length > 1) {
      setData({
        ...data,
        firstName: text,
        firstNameIsValid: true,
      });
    } else {
      setData({
        ...data,
        firstName: text,
        firstNameIsValid: false,
      });
    }
  };

  const lastNameChangeHandler = (text) => {
    if (text.trim().length > 1) {
      setData({
        ...data,
        lastName: text,
        lastNameIsValid: true,
      });
    } else {
      setData({
        ...data,
        lastName: text,
        lastNameIsValid: false,
      });
    }
  };

  const locationChangeHandler = (text) => {
    if (text.trim().length > 1) {
      setData({
        ...data,
        location: text,
        locationIsValid: true,
      });
    } else {
      setData({
        ...data,
        location: text,
        locationIsValid: false,
      });
    }
  };

  const saveChanges = () => {
    setSaving(true);
    if (data.firstName && data.lastName && data.location) {
      userContext.updateUserInfo(
        data.firstName,
        data.lastName,
        data.location,
        navigation
      );
    }

    setSaving(false);
  };

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
      <EditProfileScreenHeader
        valuesChanged={valuesChanged}
        navigation={navigation}
        saveChanges={saveChanges}
      />
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
                      color={isDefaultPhoto}
                      style={[
                        styles.cameraIcon,
                        {
                          borderColor: isDefaultPhoto,
                        },
                      ]}
                    />
                  </View>
                </ImageBackground>
              )}
            </TouchableRipple>
          </View>

          <View style={styles.editContainer}>
            <View
              style={[
                styles.formControlNoBottom,
                userContext.loading && styles.savingChanges,
              ]}
            >
              <View style={styles.rowNoBottom}>
                <Icon
                  style={{ marginRight: 15 }}
                  color={Colors.pink600}
                  name="account-circle"
                  size={30}
                />
                <TextInput
                  editable={!userContext.loading && !userContext?.googleUser}
                  placeholder="First Name"
                  style={[
                    styles.textInput,
                    userContext?.googleUser && styles.googleUser,
                  ]}
                  value={data.firstName}
                  onChangeText={(text) => firstNameChangeHandler(text)}
                />
              </View>
              {data.firstNameIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="checkbox-marked-circle-outline"
                    size={30}
                    color={Colors.green600}
                  />
                </Animatable.View>
              )}
              {!data.firstNameIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="close-circle-outline"
                    size={30}
                    color={Colors.red700}
                  />
                </Animatable.View>
              )}
            </View>
            <View
              style={[
                styles.formControlNoBottom,
                userContext.loading && styles.savingChanges,
              ]}
            >
              <View style={styles.rowNoBottom}>
                <Icon
                  style={{ marginRight: 15 }}
                  color={Colors.pink600}
                  name="account-circle-outline"
                  size={30}
                />
                <TextInput
                  editable={!userContext.loading && !userContext?.googleUser}
                  placeholder="Last Name"
                  style={[
                    styles.textInput,
                    userContext?.googleUser && styles.googleUser,
                  ]}
                  value={data.lastName}
                  onChangeText={(text) => lastNameChangeHandler(text)}
                />
              </View>
              {data.lastNameIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="checkbox-marked-circle-outline"
                    size={30}
                    color={Colors.green600}
                  />
                </Animatable.View>
              )}
              {!data.lastNameIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="close-circle-outline"
                    size={30}
                    color={Colors.red700}
                  />
                </Animatable.View>
              )}
            </View>
            <View
              style={[
                styles.formControl,
                userContext.loading && styles.savingChanges,
              ]}
            >
              <View style={styles.row}>
                <Icon
                  style={{ marginRight: 15 }}
                  color={Colors.pink600}
                  name="map-marker"
                  size={30}
                />
                <TextInput
                  editable={!userContext.loading}
                  placeholder="Last Name"
                  style={[styles.textInput]}
                  value={data.location}
                  onChangeText={(text) => locationChangeHandler(text)}
                />
              </View>
              {data.locationIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="checkbox-marked-circle-outline"
                    size={30}
                    color={Colors.green600}
                  />
                </Animatable.View>
              )}
              {!data.locationIsValid && (
                <Animatable.View animation="bounceIn" style={styles.rightIcon}>
                  <Icon
                    name="close-circle-outline"
                    size={30}
                    color={Colors.red700}
                  />
                </Animatable.View>
              )}
            </View>
            {userContext?.googleUser && (
              <Text style={styles.text}>
                Your name was provided to us through your Google account. If
                you'd like to change it, visit your Google Account settings and
                the changes will reflect here after some time. This may require a reload of the app to show up everywhere.
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Toast />
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
    justifyContent: "center",
    alignItems: "center",
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

    borderRadius: 10,
  },
  editContainer: {
    marginTop: 50,
  },
  row: {
    borderColor: Colors.grey300,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  rowNoBottom: {
    borderColor: Colors.grey300,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    width: "70%",
  },
  formControlNoBottom: {
    borderTopWidth: 0.5,
    borderColor: Colors.grey300,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formControl: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.grey300,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightIcon: {
    marginRight: 15,
  },
  savingChanges: {
    backgroundColor: Colors.grey400,
    opacity: 0.3,
  },
  googleUser: {
    opacity: 0.2,
  },
  text: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.grey400,
    fontWeight: "500",
    marginHorizontal: 10,
  },
});
