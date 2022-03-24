import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LivestreamHomePage from "../screens/Livestream/LivestreamHomePage";
import LivestreamHomeHeader from "../screens/Livestream/LivestreamHomeHeader";

const Stack = createNativeStackNavigator();
const LivestreamStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          options={({ route }) => ({
            header: (props) => (
              <LivestreamHomeHeader {...props} props={props} route={route} />
            ),
          })}
          name="LivestreamHomePage"
          component={LivestreamHomePage}
        />
      </Stack.Navigator>
    </View>
  );
};

export default LivestreamStack;

const styles = StyleSheet.create({});
