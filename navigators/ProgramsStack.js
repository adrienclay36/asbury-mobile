import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProgramsHomeHeader from "../screens/Programs/ProgramsHomeHeader";
import ProgramsHomeScreen from "../screens/Programs/ProgramsHomeScreen";
const Stack = createNativeStackNavigator();
const ProgramsStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          options={({ route }) => ({
            header: (props) => (
              <ProgramsHomeHeader {...props} props={props} route={route} />
            ),
          })}
          name="ProgramsHomeScreen"
          component={ProgramsHomeScreen}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProgramsStack;

const styles = StyleSheet.create({});
