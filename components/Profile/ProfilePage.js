import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import React, { useContext } from "react";
import { UserContext } from "../../store/UserProvider";
import { ActivityIndicator, Avatar, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from "react-native-animatable";
import { primaryFont } from "../../constants/fonts";
const IMAGE_SIZE = 100;
const ProfilePage = ({ navigation }) => {
  const userContext = useContext(UserContext);

  return (
    <Animatable.View animation="fadeIn">
      <ScrollView>
        <View style={styles.container}>
          <Avatar.Image
            source={{ uri: userContext.avatarURL }}
            size={IMAGE_SIZE}
            style={{ backgroundColor: "transparent" }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{userContext.formatName}</Text>
            <Text style={[styles.caption, { marginVertical: 5 }]}>
              {userContext.userInfo.title}
            </Text>
            <View style={[styles.row, { marginTop: 10 }]}>
              <MaterialCommunityIcons
                style={styles.icon}
                color={Colors.grey600}
                name="email"
                size={20}
              />
              <Text style={styles.text}>{userContext.userValue.email}</Text>
            </View>
            <View style={[styles.row]}>
              <MaterialIcons
                style={styles.icon}
                color={Colors.grey600}
                name="location-pin"
                size={20}
              />
              <Text style={styles.text}>{userContext.userInfo.location}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 10,
            borderBottomWidth: 0.5,
            borderColor: Colors.grey300,
            marginBottom: 20,
          }}
        />

        <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("EditProfileScreen")}>

          <View style={styles.menuRow}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="pencil-circle-outline"
              size={30}
              color={Colors.pink600}
            />
            <Text style={styles.menuItemText}>Edit Your Information</Text>
          </View>
            </TouchableOpacity>

          <View style={styles.menuRow}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="account-lock"
              size={30}
              color={Colors.pink600}
            />
            <Text style={styles.menuItemText}>Change Your Password</Text>
          </View>

          <View style={styles.menuRow}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="share"
              size={30}
              color={Colors.pink600}
            />
            <Text style={styles.menuItemText}>Tell A Friend</Text>
          </View>
        </View>
      </ScrollView>
    </Animatable.View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
  },
  infoContainer: {
    marginVertical: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
  },
  caption: {
    color: Colors.grey600,
    fontWeight: "500",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  menuContainer: {
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  menuItemText: {
    fontWeight: "600",
  },
  text: {
    textAlign: "center",
  },
});
