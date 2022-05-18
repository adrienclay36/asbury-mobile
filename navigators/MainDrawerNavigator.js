import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../store/UserProvider";
import axios from 'axios';
import { getItemById, getPublicUrl } from "../supabase-util";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeTabNavigator from "./HomeTabNavigator";
import { SERVER_URL } from "../constants/serverURL";
const Drawer = createDrawerNavigator();
import ProfileStack from "./ProfileStack";
import DrawerContent from "../components/DrawerContent/DrawerContent";
import * as Notifications from "expo-notifications";
import LibraryStack from "./LibraryStack";
import ServicesTabNavigator from "./ServicesTabNavigator";
import { StripeProvider } from "@stripe/stripe-react-native";
import RegularAnimation from "../components/ui/RegularAnimation";
const MainDrawerNavigator = ({ navigation, route }) => {
  const userContext = useContext(UserContext);

  const [publishableKey, setPublishableKey] = useState("");

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
  }, []);

  const getPublishableKey = async () => {
    const response = await axios.get(`${SERVER_URL}/keys`);

    setPublishableKey(response.data.publishableKey);
  };

  useEffect(() => {
    getPublishableKey();
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

  if ((userContext.gettingUser && userContext.init) || !publishableKey) {
    return (
      <RegularAnimation
        source={require("../loaders/dotloader.json")}
        loop={true}
      />
    );
  }

  return (
    <>
      <StripeProvider>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Home" component={HomeTabNavigator} />
          <Drawer.Screen name="ProfileStack" component={ProfileStack} />
          <Drawer.Screen name="LibraryStack" component={LibraryStack} />
          <Drawer.Screen name="Services" component={ServicesTabNavigator} />
        </Drawer.Navigator>
      </StripeProvider>
    </>
  );
};

export default MainDrawerNavigator;

const styles = StyleSheet.create({});
