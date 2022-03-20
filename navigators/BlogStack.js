import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BlogHomeScreen from "../screens/Blog/BlogHomeScreen";
import BlogProvider from "../store/BlogProvider";
const Stack = createStackNavigator();
import WebEngine from "../components/WebEngine";
import BlogDetailsScreen from "../screens/Blog/BlogDetailsScreen";
import BlogDetailsHeader from "../screens/Blog/BlogDetailsHeader";
import BlogHeader from "../screens/Blog/BlogHeader";
const BlogStack = () => {
  return (
    <WebEngine>
      <BlogProvider>
        <Stack.Navigator>
          <Stack.Screen
            options={({ route }) => ({
              headerShadowVisible: false,
              presentation: "formSheet",
              header: (props) => (
                <BlogHeader {...props} props={props} route={route} />
              ),
            })}
            name="BlogHomeScreen"
            component={BlogHomeScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              headerShadowVisible: false,
              presentation: "formSheet",
              header: (props) => (
                <BlogDetailsHeader {...props} props={props} route={route} />
              ),
            })}
            name="BlogDetailsScreen"
            component={BlogDetailsScreen}
          />
        </Stack.Navigator>
      </BlogProvider>
    </WebEngine>
  );
};

export default BlogStack;

const styles = StyleSheet.create({});
