import { Dimensions, StyleSheet, Text, View, Animated } from "react-native";
import React from "react";
import { Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
const { height: wHeight } = Dimensions.get("window");
const height = wHeight - 200;
const ITEM_SIZE = 140;
const MARGIN = 10;
const CARD_HEIGHT = ITEM_SIZE + MARGIN * 2;
const BookItem = ({
  author,
  title,
  availability,
  subject,
  deweyNumber,
  authorCode,
  scrollY,
  index,
  navigation,
  route,
}) => {
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
    <TouchableOpacity onPress={() => navigation.navigate('BookDetailsScreen', { screenTitle: title, title, availability, subject, deweyNumber, authorCode, author })}>
      <Animated.View
        style={[
          styles.shadow,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.titleText}>
              {title.length < 30 ? title : title.slice(0, 30) + "..."}
            </Text>
            <Text style={styles.infoText}>{author}</Text>
            <Text style={styles.infoText}>{subject}</Text>
            <Text
              style={[
                styles.infoText,
                {
                  marginTop: 10,
                  color: availability ? userColors.seaFoam500 : Colors.red600,
                },
              ]}
            >
              {availability ? "Available" : "Checked Out"}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.infoText}>{deweyNumber}</Text>
            <Text style={styles.infoText}>{authorCode}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default React.memo(BookItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey300,
    padding: 20,
    marginVertical: MARGIN,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: ITEM_SIZE,
  },
  authorContainer: {},
  titleText: {
    fontWeight: "700",
    color: userColors.seaFoam600,
    fontFamily: primaryFont.bold,
  },
  infoText: {
    marginVertical: 4,
    color: userColors.seaFoam800,
    fontFamily: primaryFont.regular,
  },
});
