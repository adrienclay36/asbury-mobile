import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CenteredLoader from "../ui/CenteredLoader";
import { SERVER_URL } from "../../constants/serverURL";
import { Ionicons } from "@expo/vector-icons";
import { userColors } from "../../constants/userColors";
import { Colors } from "react-native-paper";
import Carousel from "react-native-snap-carousel";
const { height, width } = Dimensions.get("window");
import { formatTime, getDateInfo } from "../../helpers/dateTimes";
import Card from "../ui/Card";
import { primaryFont } from "../../constants/fonts";
const DATE_SIZE = Dimensions.get("window").height * 0.09;
const UpcomingEventItem = ({ date, end, id, start, summary, navigation }) => {
  const formatStart = formatTime(new Date(start));
  const formatEnd = formatTime(new Date(end));
  const { day, monthText } = getDateInfo(date);
  return (
    <Card height={200}>
      <Text style={styles.eventTitle}>{summary}</Text>
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <View style={styles.dateContainer}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.month}>{monthText}</Text>
        </View>
      </View>
      <Text style={styles.time}>
        {formatStart} - {formatEnd}
      </Text>
    </Card>
  );
};

const renderEventItem = (itemData) => {
  return (
    <UpcomingEventItem
      start={itemData.item.start}
      end={itemData.item.end}
      id={itemData.item.id}
      date={itemData.item.date}
      summary={itemData.item.summary}
    />
  );
};

const UpcomingEvents = ({ navigation }) => {
  const [loading, setLoading] = useState();
  const [events, setEvents] = useState();
  const isCarousel = useRef(null);

  const getEvents = async () => {
    setLoading(true);
    const response = await axios.get(`${SERVER_URL}/events`);
    setEvents(response.data.events.slice(0, 3));

    setLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (!events) {
    return <CenteredLoader />;
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Upcoming Events</Text>
          <Ionicons
            name="calendar"
            style={{ marginLeft: 10 }}
            size={30}
            color={Colors.seaFoam600}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("EventsStack")}>
            <Text>View Events &rarr;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Carousel
        ref={isCarousel}
        data={events}
        renderItem={renderEventItem}
        sliderWidth={Dimensions.get("window").width}
        itemWidth={width - 100}
        loop={false}
      />
    </>
  );
};

export default UpcomingEvents;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
  },
  header: {
    fontSize: 25,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: primaryFont.semiBold,
    textAlign: "center",
    marginBottom: 10,
  },
  time: {
    textAlign: "center",
    fontFamily: primaryFont.semiBold,
    color: userColors.seaFoam600,
  },
  date: {
    textAlign: "center",
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.grey300,
    height: DATE_SIZE,
    width: DATE_SIZE,
    borderRadius: DATE_SIZE / 2,
  },
  day: {
    fontSize: DATE_SIZE / 3.5,
    fontFamily: primaryFont.regular,
  },
  month: {
    textTransform: "uppercase",
    fontFamily: primaryFont.semiBold,
  },
});
