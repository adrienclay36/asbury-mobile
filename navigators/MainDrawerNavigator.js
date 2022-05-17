import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { UserContext } from "../store/UserProvider";
import { supabase } from "../supabase-service";
import { getItemById, getPublicUrl } from "../supabase-util";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeTabNavigator from "./HomeTabNavigator";
import LottieView from "lottie-react-native";
const Drawer = createDrawerNavigator();
import ProfileStack from "./ProfileStack";
import DrawerContent from "../components/DrawerContent/DrawerContent";
import * as Notifications from "expo-notifications";
import LibraryStack from "./LibraryStack";
import ServicesTabNavigator from "./ServicesTabNavigator";
import CenteredLoader from "../components/ui/CenteredLoader";
const MainDrawerNavigator = ({ navigation, route }) => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
  }, []);

  const handleNotificationResponse = async (response) => {
    const type = response.notification.request.content.data.type;
    if (type === "POST_LIKED" || type === "NEW_COMMENT") {
      const postID = response.notification.request.content.data.postID;
      navigation.navigate("JoysStack");

      const post = await getItemById("prayers", postID);
      const postData = post[0];
      

      navigation.navigate("PostDetails", {
        post: postData,
      });
    }
  };

  if (userContext.gettingUser && userContext.init) {
    return (
      <LottieView source={require("../loaders/dotloader.json")} autoPlay loop />
    );
  }

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Home" component={HomeTabNavigator} />
        <Drawer.Screen name="ProfileStack" component={ProfileStack} />
        <Drawer.Screen name="LibraryStack" component={LibraryStack} />
        <Drawer.Screen name="Services" component={ServicesTabNavigator} />
      </Drawer.Navigator>
    </>
  );
};

export default MainDrawerNavigator;

const styles = StyleSheet.create({});
