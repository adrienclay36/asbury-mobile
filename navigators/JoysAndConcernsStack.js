import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoysAndConcernsHomeScreen from "../screens/JoysAndConcerns/JoysAndConcernsHomeScreen";
import NewPostScreen from "../screens/JoysAndConcerns/NewPostScreen";

const Stack = createNativeStackNavigator();
import JoysAndConcernsHeader from "../screens/JoysAndConcerns/JoysAndConcernsHeader";
import NewPostHeader from "../screens/JoysAndConcerns/NewPostHeader";
import PostDetailsScreen from "../screens/JoysAndConcerns/PostDetailsScreen";
import PostDetailsHeader from "../screens/JoysAndConcerns/PostDetailsHeader";
import EditPostScreen from "../screens/JoysAndConcerns/EditPostScreen";
const JoysAndConcernsStack = () => {

  useEffect(() => {}, []);
  
  return (
   
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
              headerShown: false,
              presentation: "formSheet",
          
            })}
            name="NewPostScreen"
            component={NewPostScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              presentation: "formSheet",
              headerShown: false,
            })}
            name="PostDetails"
            component={PostDetailsScreen}
          />
          <Stack.Screen options={{ headerShown: false, presentation: 'formSheet'}} name="EditPostScreen" component={EditPostScreen} />
        </Stack.Navigator>
      </View>
   
  );
};

export default JoysAndConcernsStack;

const styles = StyleSheet.create({});
