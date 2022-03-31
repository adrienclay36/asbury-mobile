import {
  StyleSheet,
  Text,
  View,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../constants/serverURL";
import Carousel from "react-native-snap-carousel";
import EventScreenCard from "../../components/ui/EventScreenCard";
import EventItem from "./EventItem";
import LottieView from "lottie-react-native";
import { primaryFont } from "../../constants/fonts";
const { width, height } = Dimensions.get("window");
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
    return (
      <LottieView
        source={require("../../loaders/dotloader.json")}
        autoPlay
        loop
      />
    );
  }

  const renderCardItem = (itemData) => {
    return (
      <EventScreenCard
        date={itemData.item.date}
        start={itemData.item.start}
        end={itemData.item.end}
        title={itemData.item.summary}
        image={require("../../assets/event-item-hero.jpg")}
        navigation={navigation}
      />
    );
  };
  return (
    <View>
      <Text style={styles.title}>Upcoming</Text>
      <View>
        <Carousel
          sliderWidth={width}
          itemWidth={width * 0.9 + 40}
          data={events.slice(0, 3)}
          renderItem={renderCardItem}
          layout="stack"
        />
      </View>
      <Animated.FlatList
        refreshing={loading}
        refreshControl={<RefreshControl onRefresh={getEvents} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        data={events.slice(3)}
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

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 30,
    fontSize: 20,
    fontFamily: primaryFont.semiBold,
  },
});
