import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from '../../store/UserProvider';
const AVATAR_SIZE = 30
const NewPostHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);



  const headerComponent = userContext.userInfo ? <Appbar.Content title={userContext.formatName} /> : <Appbar.Content title="New Post" />
  const imageComponent = userContext.avatarURL ? <Avatar.Image style={styles.avatar} size={AVATAR_SIZE} source={{uri: userContext.avatarURL}} /> : <Avatar.Image style={styles.avatar} size={AVATAR_SIZE} source={require("../../assets/default-2.png")} />
  return (
    <>
      <Appbar.Header
        style={[
          styles.header,
          {
            backgroundColor: userColors.seaFoam600,
          },
        ]}
      >
    
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        
        {headerComponent}
        {imageComponent}
        
      </Appbar.Header>
     
    </>
  );
};

export default NewPostHeader;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40,
    height: 100,
    backgroundColor: userColors.seaFoam500,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
  avatar: {
    marginLeft: 20,
  }
});
