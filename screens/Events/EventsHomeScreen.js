import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../constants/serverURL";
import CenteredLoader from "../../components/ui/CenteredLoader";
import EventItem from "./EventItem";
const EventsHomeScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState();
  const [events, setEvents] = useState();
  const scrollY = useRef(new Animated.Value(0)).current;

  const getEvents = async () => {
    setLoading(true);
    const response = await axios.get(`${SERVER_URL}/events`);
    setEvents(response.data.events);
    setLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (!events) {
    return <CenteredLoader />;
  }
  return (
    <View>
      <Animated.FlatList
        refreshing={loading}
        refreshControl={<RefreshControl onRefresh={getEvents} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        data={events}
        renderItem={({ item, index }) => (
          <EventItem
            navigation={navigation}
            scrollY={scrollY}
            index={index}
            date={item.date}
            start={item.start}
            end={item.end}
            summary={item.summary}
          />
        )}
      />
    </View>
  );
};

export default EventsHomeScreen;

const styles = StyleSheet.create({});
