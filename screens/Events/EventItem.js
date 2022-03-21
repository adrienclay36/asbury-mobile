import { Dimensions, StyleSheet, Text, View, Animated } from "react-native";
import React from "react";
import { getDateInfo, formatTime } from "../../helpers/dateTimes";
import { userColors } from "../../constants/userColors";
import { primaryFont } from "../../constants/fonts";
import { Colors } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
const { height, width } = Dimensions.get("window");
const DATE_SIZE = Dimensions.get("window").height * 0.1;
const ITEM_SIZE = Dimensions.get("window").height * 0.15;
const CARD_HEIGHT = ITEM_SIZE;
const EventItem = ({ date, start, end, summary, scrollY, index, navigation }) => {
  const { day, monthText } = getDateInfo(date);
  const formatStart = formatTime(new Date(start));
  const formatEnd = formatTime(new Date(end));

  const position = Animated.subtract(index * CARD_HEIGHT, scrollY);

  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT;
  const isAppearing = height;

  const translateY = Animated.add(
    scrollY,
    scrollY.interpolate({
      inputRange: [0, 0.00001 + index * CARD_HEIGHT],
      outputRange: [0, -index * CARD_HEIGHT],
      extrapolateRight: "clamp",
    })
  );

  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolateRight: "clamp",
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0],
  });

  return (
    <TouchableOpacity onPress={() => navigation.navigate("EventDetailsScreen", { formatStart, formatEnd, day, monthText, summary, })}>
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.month}>{monthText}</Text>
        </View>
        <View style={{ width: "90%", marginLeft: 20 }}>
          <Text style={styles.summary}>{summary}</Text>
          <Text style={styles.startEnd}>
            {formatStart}-{formatEnd}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderTopWidth: 1,
    marginVertical: 0,
    backgroundColor: Colors.grey50,
    borderColor: Colors.grey300,
    height: ITEM_SIZE,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
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
  summary: {
    textTransform: "uppercase",
    fontFamily: primaryFont.semiBold,
    width: "80%",
    fontSize: DATE_SIZE / 6,
  },
  startEnd: {
    textTransform: "uppercase",
    marginTop: 5,
    fontFamily: primaryFont.semiBold,
    color: userColors.seaFoam600,
  },
});
