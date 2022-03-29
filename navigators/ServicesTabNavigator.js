import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { userColors } from "../constants/userColors";
import LivestreamStack from "./LivestreamStack";
import ProgramsStack from "./ProgramsStack";
import SermonsStack from "./SermonsStack";
const Tab = createMaterialBottomTabNavigator();
const ServicesTabNavigator = () => {
  return (
    <Tab.Navigator
      activeColor={userColors.seaFoam500}
      inactiveColor={Colors.grey500}
      shifting={true}
    >
      <Tab.Screen
        options={{
          tabBarColor: Colors.white,
          tabBarLabel: "Livestream",
          tabBarIcon: ({ color }) => (
            <Icon name="video" color={color} size={24} />
          ),
        }}
        name="LivestreamStack"
        component={LivestreamStack}
      />
      <Tab.Screen
        options={{
          tabBarColor: Colors.white,
          tabBarLabel: "Programs",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-document"
              color={color}
              size={24}
            />
          ),
        }}
        name="ProgramsStack"
        component={ProgramsStack}
      />
      {/* <Tab.Screen
        options={{
          tabBarColor: Colors.white,
          tabBarLabel: "Sermons",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="multitrack-audio" color={color} size={24} />
          ),
        }}
        name="SermonsStack"
        component={SermonsStack}
      /> */}
    </Tab.Navigator>
  );
};

export default ServicesTabNavigator;

const styles = StyleSheet.create({});
