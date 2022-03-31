import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
const { width, height } = Dimensions.get("window");
const CONTAINER_HEIGHT = height * 0.6;
const HomeScreenCard = ({ title, buttonText, onPress, image, subTitle }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.bgImage}
        imageStyle={styles.image}
      >
        <Text style={styles.titleText}>
          {title}
        </Text>
        {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        {buttonText && <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={onPress} style={styles.btn}>
            <Text style={styles.btnText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>}
        
      </ImageBackground>
    </View>
  );
};

export default HomeScreenCard;

const styles = StyleSheet.create({
  bgImage: {
    width: width,
    height: CONTAINER_HEIGHT,
    margin: 20,
  },
  image: {
    width: width * .9,
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
    padding: 30,
  },
  subTitle: {
    color: Colors.white,
    fontFamily: primaryFont.light,
    padding: 30,
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
});
