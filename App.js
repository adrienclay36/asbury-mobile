import "react-native-url-polyfill/auto";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import UserProvider from "./store/UserProvider";
import MainDrawerNavigator from "./navigators/MainDrawerNavigator";
import PrayersProvider from "./store/PrayersProvider";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import { useFonts } from "expo-font";
import HomeTabNavigator from "./navigators/HomeTabNavigator";
import AppLoading from "expo-app-loading";
import AuthStack from "./navigators/AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartupScreen from "./screens/Auth/StartupScreen";
const AppStack = createNativeStackNavigator();
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const [fontsLoaded] = useFonts({
    "red-hat-regular": require("./assets/fonts/RedHatDisplay-Regular.ttf"),
    "red-hat-bold": require("./assets/fonts/RedHatDisplay-Bold.ttf"),
    "red-hat-semiBold": require("./assets/fonts/RedHatDisplay-SemiBold.ttf"),
    "red-hat-medium": require("./assets/fonts/RedHatDisplay-Medium.ttf"),
    "red-hat-light": require("./assets/fonts/RedHatDisplay-Light.ttf"),
    "red-hat-extraBold": require("./assets/fonts/RedHatDisplay-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <UserProvider>
      <PrayersProvider>
        <SafeAreaProvider>
          <PaperProvider>
            <NavigationContainer>
              <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen
                  name="StartupScreen"
                  component={StartupScreen}
                />
                <AppStack.Screen name="AuthStack" component={AuthStack} />
                <AppStack.Screen
                  name="AppStack"
                  component={MainDrawerNavigator}
                />
              </AppStack.Navigator>
              <StatusBar style="auto" />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </PrayersProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
