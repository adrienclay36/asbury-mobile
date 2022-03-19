import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LibraryStack from "./LibraryStack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import JoysAndConcernsStack from "./JoysAndConcernsStack";
import { userColors } from "../constants/userColors";
import BlogStack from "./BlogStack";
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

          tabBarLabel: "Announcements",

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

          tabBarLabel: "Library",

          tabBarIcon: ({ color }) => (
            <Icon name="book" color={color} size={24} />
          ),
        }}
        name="LibraryStack"
        component={LibraryStack}
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
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;

const styles = StyleSheet.create({});
