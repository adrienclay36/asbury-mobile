import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LibraryHomeScreen from "../screens/Library/LibraryHomeScreen";
const Stack = createNativeStackNavigator();
import LibraryContextProvider from "../store/LibraryContextProvider";
import BookDetailsScreen from "../screens/Library/BookDetailsScreen";
import BookDetailsHeader from "../components/ui/BookDetailsHeader";
import LibraryHeader from "../screens/Library/LibraryHeader";

const LibraryStack = () => {
  return (
    <LibraryContextProvider>
      <View style={{ flex: 1 }} collapsable={false}>
        <Stack.Navigator>
          <Stack.Screen
            options={({ route }) => ({
              header: (props) => (
                <LibraryHeader
                  {...props}
                  props={props}
                  route={route}
                  
                />
              ),
              title: route.params?.screenTitle,
              headerShown: true,
            })}
            name="LibraryHome"
            component={LibraryHomeScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              header: (props) => (
                <BookDetailsHeader
                  {...props}
                  props={props}
                  route={route}
                  title={route.params?.title}
                />
              ),
              title: route.params?.screenTitle,
              headerShown: true,
            })}
            name="BookDetailsScreen"
            component={BookDetailsScreen}
          />
        </Stack.Navigator>
      </View>
    </LibraryContextProvider>
  );
};

export default LibraryStack;

const styles = StyleSheet.create({});
