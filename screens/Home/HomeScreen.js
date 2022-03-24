import { RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import HomeScreenHeader from "./HomeScreenHeader";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";

import VerseOfTheDay from "../../components/Home/VerseOfTheDay";
import RecentPosts from "../../components/Home/RecentPosts";
import { ScrollView } from "react-native-gesture-handler";
import UpcomingEvents from "../../components/Home/UpcomingEvents";
const HomeScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const prayerContext = useContext(PrayerContext)
  

  return (
    <>
      <HomeScreenHeader navigation={navigation} />
      <ScrollView refreshControl={<RefreshControl refreshing={prayerContext.loading} onRefresh={() => prayerContext.refreshPosts()} />}>
        <VerseOfTheDay />
        <RecentPosts navigation={navigation} />
        <UpcomingEvents navigation={navigation}/>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
