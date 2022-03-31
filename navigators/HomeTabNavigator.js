import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../store/UserProvider";
import { PrayerContext } from "../store/PrayersProvider";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import JoysAndConcernsStack from "./JoysAndConcernsStack";
import { userColors } from "../constants/userColors";
import BlogStack from "./BlogStack";
import GivingStack from "./GivingStack";
import EventsStack from "./EventsStack";
import HomeStack from "./HomeStack";
import Toast from "react-native-toast-message";
const Tab = createMaterialBottomTabNavigator();
import { BlogContext } from "../store/BlogProvider";

const HomeTabNavigator = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const prayerContext = useContext(PrayerContext);
  const blogContext = useContext(BlogContext);

  const navigateToEditProfile = () => {
    navigation.navigate("ProfileStack");
    setTimeout(() => {
      navigation.navigate("EditProfileScreen");
    }, 250);
  };

  const newUserNotification = () => {
    setTimeout(() => {
      console.log("Showing Toast: HomeTabNavigator");
      Toast.show({
        type: "info",
        text1: "Welcome To Asbury Mobile!",
        text2: "Click Here To Finish Setting Up Your Account!",
        topOffset: 75,
        position: "top",
        visibilityTime: 15000,
        onPress: navigateToEditProfile,
      });
    }, 2000);
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

  return (
    <>
     
        <Tab.Navigator
          activeColor={userColors.seaFoam500}
          inactiveColor={Colors.grey500}
          shifting={true}
        >
          <Tab.Screen
            options={{
              tabBarColor: Colors.white,
              
              tabBarLabel: "Home",

              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="shield-cross"
                  color={color}
                  size={24}
                />
              ),
            }}
            name="HomeStack"
            component={HomeStack}
          />

          <Tab.Screen
            options={{
              tabBarColor: Colors.white,
              tabBarBadge: blogContext.badgeCount === 0 ? null : blogContext.badgeCount,
              tabBarLabel: "Bulletins",

              tabBarIcon: ({ color }) => (
                <Icon name="list-ul" color={color} size={24} />
              ),
            }}
            name="BlogStack"
            component={BlogStack}
          />
          <Tab.Screen
            options={{
              tabBarColor: Colors.white,

              tabBarLabel: "Events",

              tabBarIcon: ({ color }) => (
                <Icon name="calendar-week" color={color} size={24} />
              ),
            }}
            name="EventsStack"
            component={EventsStack}
          />
          <Tab.Screen
            options={{
              tabBarBadge: prayerContext.badgeCount === 0 ? null : prayerContext.badgeCount,
              tabBarColor: Colors.white,
              tabBarLabel: "Feed",

              tabBarIcon: ({ color }) => (
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  color={color}
                  size={24}
                />
              ),
            }}
            name="JoysStack"
            component={JoysAndConcernsStack}
          />

          <Tab.Screen
            options={{
              tabBarColor: Colors.white,
              tabBarLabel: "Giving",

              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-cash"
                  color={color}
                  size={24}
                />
              ),
            }}
            name="GivingStack"
            component={GivingStack}
          />
        </Tab.Navigator>
        <Toast />
     
    </>
  );
};

export default HomeTabNavigator;

const styles = StyleSheet.create({});
