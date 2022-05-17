import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BlogHomeScreen from "../screens/Blog/BlogHomeScreen";
const Stack = createStackNavigator();
import BlogDetailsScreen from "../screens/Blog/BlogDetailsScreen";

const BlogStack = () => {
  return (

      
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            
            name="BlogHomeScreen"
            component={BlogHomeScreen}
          />
          <Stack.Screen
           
            name="BlogDetailsScreen"
            component={BlogDetailsScreen}
          />
        </Stack.Navigator>
   

  );
};

export default BlogStack;

const styles = StyleSheet.create({});
