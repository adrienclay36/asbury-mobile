import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LibraryStack from "./LibraryStack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import Feather from 'react-native-vector-icons/Feather';
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JoysAndConcernsStack from "./JoysAndConcernsStack";
import { userColors } from "../constants/userColors";
import BlogStack from "./BlogStack";
import GivingStack from "./GivingStack";
import EventsStack from "./EventsStack";
import HomeStack from "./HomeStack";
const Tab = createMaterialBottomTabNavigator();
const HomeTabNavigator = () => {
  return (
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

          tabBarLabel: "Bulletins",

          tabBarIcon: ({ color }) => (
            <Icon name="bell" color={color} size={24} />
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
          tabBarColor: Colors.white,
          tabBarLabel: "Joys/Concerns",

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
  );
};

export default HomeTabNavigator;

const styles = StyleSheet.create({});
