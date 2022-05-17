import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React from "react";
import Card from "../../components/ui/Card";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors, Button } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { userColors } from "../../constants/userColors";
const { height, width } = Dimensions.get("window");
import DrawerHeader from "../../components/ui/DrawerHeader";
const ITEM_SIZE = height;
const NoAccountScreen = ({ navigation }) => {
  return (
    <>
    <DrawerHeader/>
      <View style={{ height: height * 0.2 }}></View>
      <Animatable.View animation="fadeInUpBig">
        <Card height={ITEM_SIZE}>
          <Text style={styles.titleText}>
            Sign In/Sign Up To View Giving Options!
          </Text>
          <View style={styles.highlightContainer}>
            <View style={styles.row}>
              <Ionicons
                color={Colors.pink600}
                style={styles.icon}
                name="map-outline"
                size={20}
              />

              <Text style={styles.highlight}>Track Your Donations</Text>
            </View>
            <View style={styles.row}>
              <Ionicons style={styles.icon} name="md-checkmark-circle-sharp" size={30} color={Colors.pink600} />
              <Text style={styles.highlight}>Make One Time Donations</Text>
            </View>
            <View style={styles.row}>
                <Ionicons style={styles.icon} name="md-checkmark-done-circle-sharp" size={30} color={Colors.pink600}/>
            <Text style={styles.highlight}>
              Set Up And Manage Recurring Donations
            </Text>
            </View>
          </View>
          <View>
            <Button mode="contained" onPress={() => navigation.replace("AuthStack")} color={userColors.seaFoam700}>
              Get Started
            </Button>
          </View>
        </Card>
      </Animatable.View>
    </>
  );
};

export default NoAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 25,
    fontWeight: "600",
  },
  tab: {
    backgroundColor: Colors.white,
    height: height,
    width: width,
  },
  highlight: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  highlightContainer: {
    marginVertical: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
      marginRight: 5,
  }
});
