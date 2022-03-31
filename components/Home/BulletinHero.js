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
const BulletinHero = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/bulletin-hero.jpg")}
        resizeMode="cover"
        style={styles.bgImage}
        imageStyle={styles.image}
      >
        <Text style={styles.titleText}>
          Stay Up With The Latest Information
        </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>View Bulletins</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default BulletinHero;

const styles = StyleSheet.create({
  bgImage: {
    width: width,
    height: CONTAINER_HEIGHT,
    margin: 20,
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
  },
  container: {
    height: CONTAINER_HEIGHT,
    backgroundColor: Colors.white,
  },
  titleText: {
    color: Colors.white,
    fontFamily: primaryFont.semiBold,
    fontSize: 25,
    width: "80%",
    padding: 30,
  },
  btn: {
    backgroundColor: Colors.grey100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    height: 50,
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  btnText: {
      fontFamily: primaryFont.medium,
  }
});
