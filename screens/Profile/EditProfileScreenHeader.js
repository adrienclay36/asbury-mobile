import {
  Dimensions,
  Platform,
  PlatformColor,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../store/UserProvider";
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT =
  Platform.OS === "android" ? height * 0.14 : height * 0.15;
const EditProfileScreenHeader = ({ navigation, saveChanges, valuesChanged, loading }) => {
  const userContext = useContext(UserContext);
  
  


  return (
    <>
      <SafeAreaView style={styles.header}>
        <View style={styles.contentContainer}>
          <Appbar.BackAction
            
            color={Platform.OS === "android" ? Colors.white : Colors.grey700}
            onPress={() => navigation.goBack()}
          />
          
          <Button
            onPress={saveChanges}
            
            mode={Platform.OS === "android" ? "outlined" : "contained"}
            loading={loading}
            disabled={!valuesChanged.firstNameChanged && !valuesChanged.lastNameChanged && !valuesChanged.locationChanged || loading}
            style={{
              backgroundColor:
                Platform.OS === "android"
                  ? Colors.blueGrey800
                  : userColors.seaFoam600,
            }}
            color={
              Platform.OS === "android" ? Colors.white : userColors.seaFoam600
            }
          >
            Save
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EditProfileScreenHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : 'transparent',
    height: HEADER_HEIGHT,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === 'android' ? HEADER_HEIGHT / 8 : HEADER_HEIGHT / 6,
    marginHorizontal: 20,
  },
  userContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: "transparent",
  },
  headerText: {
    color: Platform.OS === "android" ? Colors.white : Colors.black,
    fontFamily: primaryFont.semiBold,
  },
});
