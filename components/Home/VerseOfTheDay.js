import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../ui/Card";
import { Colors } from "react-native-paper";
const { height, width } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
const votdImages = [
  require("../../assets/votd/votd-1.jpg"),
  require("../../assets/votd/votd-2.jpg"),
  require("../../assets/votd/votd-3.jpg"),
  require("../../assets/votd/votd-4.jpg"),
  require("../../assets/votd/votd-5.jpg"),
];
const VOTD_HEIGHT = height * 0.3;
import { SliderBox } from 'react-native-image-slider-box';
import { primaryFont } from "../../constants/fonts";
const randomImage =
  votdImages[Math.floor(Math.random() * votdImages.length) + 1];
const VerseOfTheDay = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const getVerses = async () => {
    const response = await axios.get(
      "https://labs.bible.org/api/?passage=votd&type=json&formatting=plain"
    );
    if (response.data.length > 0) {
      const {
        bookname,
        chapter,
        text: verseText,
        verse: fetchedVerse,
      } = response.data[0];
      const fullTitle = `${bookname} ${chapter}:${fetchedVerse}`;
      setTitle(fullTitle);
      setText(verseText);
    }
  };
  useEffect(() => {
    getVerses();
  }, []);

  if (!title || !text) {
    return <View style={styles.placeholder}/>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/votd/votd-2.jpg")}
        resizeMode="cover"
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,.4)"]}
          style={styles.background}
        />

        <Text style={styles.text}>{title}</Text>
        <Text style={[styles.text, styles.verse]}>{text}</Text>
      </ImageBackground>
    </View>
  );
};

export default VerseOfTheDay;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  backgroundImage: {
    height: VOTD_HEIGHT,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

    opacity: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: "100%",
    opacity: 0.3,
  },
  title: {
    color: Colors.white,
    fontWeight: "700",
  },
  text: {
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: 10,
 
    fontSize: 20,
  },
  verse: {
    marginTop: 10,
    fontSize: 16,

  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: VOTD_HEIGHT,
  },
  placeholder: {
    width: width,
    height: VOTD_HEIGHT,
  }
});
