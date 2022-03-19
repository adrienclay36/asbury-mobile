import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoysAndConcernsHomeScreen from "../screens/JoysAndConcerns/JoysAndConcernsHomeScreen";
import NewPostScreen from "../screens/JoysAndConcerns/NewPostScreen";
import PrayersProvider from "../store/PrayersProvider";
const Stack = createNativeStackNavigator();
import JoysAndConcernsHeader from "../screens/JoysAndConcerns/JoysAndConcernsHeader";
import NewPostHeader from "../screens/JoysAndConcerns/NewPostHeader";
import PostDetailsScreen from "../screens/JoysAndConcerns/PostDetailsScreen";
import PostDetailsHeader from "../screens/JoysAndConcerns/PostDetailsHeader";
const JoysAndConcernsStack = () => {
  
  return (
    <PrayersProvider>
      <View style={{ flex: 1 }} collapsable={false}>
        <Stack.Navigator>
          <Stack.Screen
            options={({ route }) => ({
              header: (props) => (
                <JoysAndConcernsHeader {...props} props={props} route={route} />
              ),
            })}
            name="JoysAndConcernsHome"
            component={JoysAndConcernsHomeScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              presentation: "formSheet",
              header: (props) => (
                <NewPostHeader {...props} props={props} route={route} />
              ),
            })}
            name="NewPostScreen"
            component={NewPostScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              presentation: "formSheet",
              header: (props) => (
                <PostDetailsHeader {...props} props={props} route={route} />
              ),
              
            })}
            name="PostDetails"
            component={PostDetailsScreen}
          />
        </Stack.Navigator>
      </View>
    </PrayersProvider>
  );
};

export default JoysAndConcernsStack;

const styles = StyleSheet.create({});
