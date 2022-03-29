import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import SermonsHomeHeader from "../screens/Sermons/SermonsHomeHeader";
import SermonsHomeScreen from "../screens/Sermons/SermonsHomeScreen";
const Stack = createNativeStackNavigator();
const SermonsStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          options={({ route }) => ({
            header: (props) => (
              <SermonsHomeHeader {...props} props={props} route={route} />
            ),
          })}
          name="SermonsHomeScreen"
          component={SermonsHomeScreen}
        />
      </Stack.Navigator>
    </View>
  );
};

export default SermonsStack;

const styles = StyleSheet.create({});
