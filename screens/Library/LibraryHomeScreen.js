import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  FlatList,
} from "react-native";
import React, { useContext, useRef, useState } from "react";

import { LibraryContext } from "../../store/LibraryContextProvider";
import BookItem from "./BookItem";
import { primaryFont } from "../../constants/fonts";
import LottieView from 'lottie-react-native';
import { TextInput } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import * as Animatable from "react-native-animatable";
const LibraryHomeScreen = ({ navigation, route }) => {
  const libraryContext = useContext(LibraryContext);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState("");

  const clearInputIcon = (
    <TextInput.Icon
      onPress={() => setQueryHandler("")}
      color="#C6C6C6"
      name={"backspace-outline"}
    />
  );

  const searchInputIcon = (
    <TextInput.Icon name="magnify-plus-outline" color="#c6c6c6" />
  );

  const setQueryHandler = (text) => {
    setQuery(text);
    libraryContext.setQuery(text);
  };

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

     <Animatable.View animation="fadeIn" style={styles.searchContainer}>
        <TextInput
          theme={{ colors: { primary: userColors.seaFoam600 }, }}
          
          style={{ backgroundColor: 'white', color: 'black' }}
          placeholderTextColor='black'
          
          label="Start Typing To Search"
          selectionColor={userColors.seaFoam600}
          value={query}
          onChangeText={(text) => setQueryHandler(text)}
          mode={"outlined"}
          underlineColor={userColors.seaFoam600}
          right={query.length > 0 ? clearInputIcon : searchInputIcon}
          placeholder="Start Typing To Search"
        />
      </Animatable.View>
      {libraryContext.loading && <LottieView source={require("../../loaders/dotloader.json")} autoPlay loop />}
      {libraryContext.noData && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontFamily: primaryFont.bold }}>
            No Books Found...
          </Text>
        </View>
      )}
      <Animatable.View animation="fadeInUpBig">
        {!libraryContext.noData && !libraryContext.loading && (
          <Animated.FlatList
            initialNumToRender={20}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            data={libraryContext.books}
            renderItem={(itemData) => renderBookItem(itemData)}
          />
        )}
      </Animatable.View>
    </>
  );
};

export default LibraryHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
