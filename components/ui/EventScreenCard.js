import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
const { width, height } = Dimensions.get("window");
import { getDateInfo, formatTime } from "../../helpers/dateTimes";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
const CONTAINER_HEIGHT = Platform.OS === 'android' ? height * .35 : height * .25;
const EventScreenCard = ({ title, start, end, date, image, navigation }) => {
  const { day, monthText } = getDateInfo(date);
  const formatDate = new Date(date).toLocaleDateString();
  
  const formatStart = formatTime(new Date(start));
  const formatEnd = formatTime(new Date(end));
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("EventDetailsScreen", {
          formatStart,
          formatEnd,
          day,
          monthText,
          summary: title,
        })
      }
      style={styles.container}
    >
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.bgImage}
        imageStyle={styles.image}
      >
        <Text style={styles.titleText}>{title}</Text>
        <Text style={[styles.subTitle, styles.date]}>
          {monthText} {day}
        </Text>
        <Text style={styles.subTitle}>
          {formatStart} - {formatEnd}
        </Text>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default EventScreenCard;

const styles = StyleSheet.create({
  bgImage: {
    width: width,
    height: CONTAINER_HEIGHT,
    margin: 20,
  },
  image: {
    width: width * 0.9,
    height: "90%",
    borderRadius: 20,
  },
  container: {
    height: CONTAINER_HEIGHT,
  },
  titleText: {
    color: Colors.white,
    fontFamily: primaryFont.semiBold,
    fontSize: 25,
    width: "80%",
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
  },
  subTitle: {
    color: Colors.white,
    fontFamily: primaryFont.light,
    paddingHorizontal: 35,
    paddingTop: 10,
    fontSize: 15,
    width: "60%",
  },
  btn: {
    backgroundColor: Colors.grey100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    height: 50,
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  btnText: {
    fontFamily: primaryFont.medium,
  },
  date: {
    letterSpacing: 3,
    fontSize: 20, 
  }
});
