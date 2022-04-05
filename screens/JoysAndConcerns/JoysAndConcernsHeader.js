import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../store/UserProvider";
const JoysAndConcernsHeader = ({ navigation, route, back, props, title }) => {
  const userContext = useContext(UserContext);



  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      source={{ uri: userContext.avatarURL }}
      size={30}
      style={{ backgroundColor: "transparent", marginLeft: 30, }}
    />
  ) : (
    <Avatar.Image
      source={require("../../assets/default-2.png")}
      size={30}
      style={{ backgroundColor: "transparent", marginLeft: 30 }}
    />
  );


  const userHeader = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {imageComponent}
      <Text style={{ marginLeft: 10 }}>
        {userContext.userInfo?.first_name}'s Feed
      </Text>
    </View>
  );
  const nonUserHeader = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {imageComponent}
      <Text style={{ marginLeft: 10 }}>
        Joys & Concerns
      </Text>
    </View>
  );

  return (
    <>
      <SafeAreaView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
       
        }}
      >
        {userContext.userInfo ? userHeader : nonUserHeader}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

        <Appbar.Action
          icon="plus"
          size={30}
          color={Colors.grey900}
          onPress={() => navigation.navigate("NewPostScreen")}
        />
        <Appbar.Action
          icon="menu"
          size={30}
          color={Colors.grey900}
          onPress={() => navigation.openDrawer()}
          />
          </View>
      </SafeAreaView>
    </>
  );
};

export default JoysAndConcernsHeader;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40,
    height: 100,
    backgroundColor: userColors.seaFoam500,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  welcome: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
  actionButtons: {
    justifyContent: "center",
    alignItems: 'flex-end',
  },
});
