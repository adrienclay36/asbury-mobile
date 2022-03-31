import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
const Stack = createNativeStackNavigator();
import HomeScreen from "../screens/Home/HomeScreen";

const HomeStack = () => {
  return (
   
      <View style={{ flex: 1 }} collapsable={false}>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="HomeScreen"
            component={HomeScreen}
          />
        </Stack.Navigator>
      </View>

  );
};

export default HomeStack;

const styles = StyleSheet.create({});
