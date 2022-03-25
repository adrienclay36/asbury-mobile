import { RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import HomeScreenHeader from "./HomeScreenHeader";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";
import axios from "axios";
import { SERVER_URL } from "../../constants/serverURL";
import VerseOfTheDay from "../../components/Home/VerseOfTheDay";
import RecentPosts from "../../components/Home/RecentPosts";
import { ScrollView } from "react-native-gesture-handler";
import UpcomingEvents from "../../components/Home/UpcomingEvents";
import Toast from "react-native-toast-message";
const HomeScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const prayerContext = useContext(PrayerContext);

  const [loading, setLoading] = useState();
  const [events, setEvents] = useState();

  const getEvents = async () => {
    setLoading(true);
    const response = await axios.get(`${SERVER_URL}/events`);
    setEvents(response.data.events.slice(0, 3));

    setLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  

  return (
    <>
      <HomeScreenHeader navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
          refreshing={prayerContext.loading}
          onRefresh={() => {
            prayerContext.refreshPosts();
            getEvents();
          }}
          />
        }
      >
        <VerseOfTheDay />
        <RecentPosts navigation={navigation} />
        <UpcomingEvents events={events} navigation={navigation} />
        
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
