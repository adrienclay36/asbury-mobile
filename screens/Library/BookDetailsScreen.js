import { StyleSheet, Text, Animated } from "react-native";
import React, { useContext, useRef } from "react";
import BookDetailsHeader from "../../components/ui/BookDetailsHeader";
import { StatusBar } from "expo-status-bar";
import { userColors } from "../../constants/userColors";
import { Colors } from "react-native-paper";
import Card from "../../components/ui/Card";
import { primaryFont } from "../../constants/fonts";
import { LibraryContext } from "../../store/LibraryContextProvider";
import CenteredLoader from "../../components/ui/CenteredLoader";
import { FlatList } from "react-native-gesture-handler";
import BookItem from "./BookItem";
const BookDetailsScreen = ({ navigation, route }) => {
  const libraryContext = useContext(LibraryContext);
  const byAuthor = libraryContext.books.filter(
    (book) =>
      book.author === route.params?.author && book.title !== route.params?.title
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderBookItem = (itemData) => {
    return (
      <BookItem
        title={itemData.item.title}
        author={itemData.item.author}
        deweyNumber={itemData.item.deweynumber}
        subject={itemData.item.subject}
        authorCode={itemData.item.authorcode}
        availability={itemData.item.availability}
        scrollY={scrollY}
        index={itemData.index}
        navigation={navigation}
      />
    );
  };

  return (
    <>
      <Card>
        <Text style={styles.title} numberOfLines={2}>
          {route.params?.title}
        </Text>
        <Text style={styles.subject} numberOfLines={2}>
          {route.params?.subject}
        </Text>
        <Text
          style={[styles.subject, { fontFamily: primaryFont.bold }]}
          numberOfLines={2}
        >
          {route.params?.author}
        </Text>
        <Text style={styles.subject} numberOfLines={2}>
          {route.params?.deweyNumber}
        </Text>
        <Text style={styles.subject} numberOfLines={2}>
          {route.params?.authorCode}
        </Text>
        <Text
          style={[
            styles.subject,
            {
              fontFamily: primaryFont.bold,
              color: route.params?.availability
                ? userColors.seaFoam600
                : Colors.red600,
            },
          ]}
          numberOfLines={2}
        >
          {route.params?.availability ? "Available" : "Checked Out"}
        </Text>
      </Card>

      {byAuthor.length > 0 && (
        <>
          <Text style={styles.moreBy}>More By This Author</Text>
          <Animated.FlatList
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            data={byAuthor}
            renderItem={(itemData) => renderBookItem(itemData)}
          />
        </>
      )}
    </>
  );
};

export default BookDetailsScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: primaryFont.regular,
    marginVertical: 10,
  },
  subject: {
    fontFamily: primaryFont.regular,
    color: userColors.seaFoam500,
    textAlign: "center",
    marginBottom: 10,
  },
  moreBy: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: primaryFont.bold,
    color: userColors.seaFoam600,
    marginVertical: 20,
  },
});
