import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import CenteredLoader from "../../components/ui/CenteredLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
import * as SecureStore from 'expo-secure-store';
import { ASBURY_KEY_ONE, ASBURY_KEY_TWO } from '@env';
const StartupScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  

  const refreshSession = async (token) => {

    const { data, error } = await supabase.auth.signIn({
      refreshToken: token,
    });
    if (error) {
      console.log("Error: StarupScreen:: ", error);
      console.log("Logging in with stored credentials if present.");
      const email = await SecureStore.getItemAsync(ASBURY_KEY_ONE)

      if(email) {
        const password = await SecureStore.getItemAsync(ASBURY_KEY_TWO);
        if(password) {
          const { data: signInData, error: ReAuthError } = await supabase.auth.signIn({email, password});
          if(ReAuthError) {
            console.log("Error: StartupScreen::, ", ReAuthError)
          }

          if(signInData?.user) {
            if(signInData.user?.aud === 'authenticated'){
              userContext.checkUser();
              return { status: 'ok' }
            }
          }

          return { };
        }
      } else {
        console.log("No stored credentials present: StartUpScreen");
        
      }
      return { status: "error", message: error.message };
    }
    userContext.checkUser();
    return { status: "ok" };
  };


  const getAuthStatus = async () => {
    const token = await AsyncStorage.getItem("asbury_auth");
    if (token) {
      const response = await refreshSession(token);
      if (response.status === "ok" && !userContext.gettingUser) {
        navigation.replace("AppStack");
        return;
      } 
    }
    
    navigation.replace("AppStack");
  };

  useEffect(() => {
    getAuthStatus();
  }, []);



  return <CenteredLoader />;
};

export default StartupScreen;

const styles = StyleSheet.create({});
