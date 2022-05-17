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
} from "react-native-paper";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import AuthStack from "./navigators/AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartupScreen from "./screens/Auth/StartupScreen";
const AppStack = createNativeStackNavigator();
import { SafeAreaProvider } from "react-native-safe-area-context";
import BlogProvider from "./store/BlogProvider";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const [fontsLoaded] = useFonts({
    "red-hat-regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    "red-hat-bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    "red-hat-semiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "red-hat-medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    "red-hat-light": require("./assets/fonts/Poppins/Poppins-Light.ttf"),
    "red-hat-extraBold": require("./assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <UserProvider>
      <PrayersProvider>
        <BlogProvider>
          <PaperProvider>

            <SafeAreaProvider>
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
            </SafeAreaProvider>
          </PaperProvider>
          
        </BlogProvider>
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
