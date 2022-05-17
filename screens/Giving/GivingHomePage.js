import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect, useContext } from "react";
import ProfileCard from "../../components/Giving/ProfileCard";
import { UserContext } from "../../store/UserProvider";
import DrawerHeader from "../../components/ui/DrawerHeader";
const GivingHomePage = ({ navigation, route }) => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      userContext.checkUser();
    });
    return unsubscribe;
  }, [navigation]);

  if (!userContext.userValue) {
    return <Text>Sign in To View Giving Options</Text>;
  }

  return (
    <>
    <DrawerHeader/>
      <ProfileCard navigation={navigation} />
    </>
  );
};

export default GivingHomePage;

const styles = StyleSheet.create({});
