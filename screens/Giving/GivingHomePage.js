import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect, useContext } from "react";
import ProfileCard from "../../components/Giving/ProfileCard";
import { UserContext } from "../../store/UserProvider";
const GivingHomePage = ({ navigation, route }) => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      userContext.checkUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <ProfileCard navigation={navigation} />
    </>
  );
};

export default GivingHomePage;

const styles = StyleSheet.create({});
