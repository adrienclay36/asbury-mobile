import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import CenteredLoader from "../../components/ui/CenteredLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
const StartupScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);

  const refreshSession = async (token) => {

    const { data, error } = await supabase.auth.signIn({
      refreshToken: token,
    });
    if (error) {
      console.log(error);
      

      return { status: "error", message: error.message };
    }
    userContext.checkUser();
    return { status: "ok" };
  };


  const getAuthStatus = async () => {
    const token = await AsyncStorage.getItem("asbury_auth");
    if (token) {
      const response = await refreshSession(token);
      if (response.status === "ok") {
        navigation.replace("AppStack");
      } else {
        navigation.replace("AuthStack");
      }
    } else {
      navigation.replace("AuthStack");
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);
  return <CenteredLoader />;
};

export default StartupScreen;

const styles = StyleSheet.create({});
