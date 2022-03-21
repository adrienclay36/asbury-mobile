import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";
import { userColors } from "../../constants/userColors";
import { Appbar, Avatar, Button, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../store/UserProvider";
import { PrayerContext } from "../../store/PrayersProvider";
import UserHeader from "../../components/Headers/UserHeader";
const AVATAR_SIZE = 40;
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT =
  Platform.OS === "android" ? height * 0.13 : height * 0.109;
const EventDetailsHeader = ({
  navigation,
  route
}) => {
  const userContext = useContext(UserContext);
  const { formatStart, formatEnd, day, monthText, summary } = route?.params;

  const headerComponent = <Text style={styles.headerText}>{summary.length > 30 ? summary.slice(0, 30) + "..." : summary}</Text>


  return (
    <>
      <UserHeader style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Appbar.BackAction
          style={{
            transform: [{ rotate: Platform.OS === "ios" ? "-90deg" : "0deg" }],
          }}
          color={Platform.OS === "android" ? Colors.white : Colors.grey700}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.userContainer}>
          {headerComponent}
        </View>

        <Appbar.Action icon="share" color={Platform.OS === 'android' ? Colors.white : Colors.grey700} />
        
      </UserHeader>
    </>
  );
};

export default EventDetailsHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor:
      Platform.OS === "android" ? userColors.seaFoam600 : Colors.grey300,
    height: HEADER_HEIGHT,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: HEADER_HEIGHT / 6,
    marginHorizontal: 20,
  },
  userContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: "transparent",
  },
  headerText: {
    color: Platform.OS === "android" ? Colors.white : Colors.black,
    fontFamily: primaryFont.semiBold,
    fontSize: 18,
    textAlign: 'center'
  },
});
