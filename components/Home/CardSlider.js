import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Carousel from "react-native-snap-carousel";
import HomeScreenCard from "../ui/HomeScreenCard";
const { width, height } = Dimensions.get("window");
import LottieView from 'lottie-react-native';
import axios from "axios";
const CONTAINER_HEIGHT = height * 0.6;
const CardSlider = ({ navigation }) => {
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

  const cardItems = [
    {
      title: title,
      subTitle: text ? text : "",
      image: require("../../assets/votd-hero.jpg"),
    },
    {
      title: "Stay Up With The Latest Information",
      image: require("../../assets/bulletin-hero.jpg"),
      buttonText: "View Bulletins",
      onPress: () => navigation.navigate("BlogStack"),
      subTitle: "check the latest asbury news and updates.",
    },
    {
      title: "Consider A Donation",
      image: require("../../assets/giving-hero.jpg"),
      buttonText: "Donate",
      onPress: () => navigation.navigate("GivingStack"),
      subTitle: "donations help keep asbury's mission and purpose alive.",
    },
    {
      title: "Share Your Joys and Concerns",
      image: require("../../assets/joys-hero.jpg"),
      buttonText: "Post Now",
      onPress: () => navigation.navigate("JoysStack"),
      subTitle: "let the congregation know what's going on.",
    },
    {
      title: "Visit The Library",
      subTitle: "browse the growing collection of asbury's books.",
      onPress: () => {
        navigation.openDrawer();
        setTimeout(() => {
          navigation.navigate("LibraryStack");
        }, 500);
      },
      buttonText: "View Books",
      image: require("../../assets/books-hero.jpg"),
    },
    {
      title: "View Available Worship Services",
      subTitle: "watch livestreams and get the latest programs.",
      onPress: () => {
        navigation.openDrawer();
        setTimeout(() => {
          navigation.navigate("Services");
        }, 500);
      },
      buttonText: "View Services",
      image: require("../../assets/services-hero.jpg"),
    },
  ];

  const renderCardItem = (itemData) => {
    return (
      <HomeScreenCard
        title={itemData.item.title}
        subTitle={itemData.item?.subTitle}
        image={itemData.item.image}
        buttonText={itemData.item.buttonText}
        onPress={itemData.item.onPress}
      />
    );
  };

  const carousel = useRef();

  if (!text) {
    return (
    <View style={{ height: CONTAINER_HEIGHT }}>
      <LottieView source={require("../../loaders/dotloader.json")} autoPlay loop />
    </View>
    );
  }
  return (
    <View>
      <Carousel
        ref={carousel}
        data={cardItems}
        renderItem={renderCardItem}
        sliderWidth={width}
        itemWidth={width * 0.9 + 40}
        layout="stack"
        loop
      />
    </View>
  );
};

export default CardSlider;

const styles = StyleSheet.create({});
