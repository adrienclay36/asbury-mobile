import { StyleSheet, View } from "react-native";
import React, { useState, useContext } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { userColors } from "../../constants/userColors";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Colors,
} from "react-native-paper";
import { UserContext } from "../../store/UserProvider";
import { TouchableOpacity } from "react-native-gesture-handler";

const DrawerContent = (props) => {
  const userContext = useContext(UserContext);

  const imageComponent = userContext.avatarURL ? (
    <Avatar.Image
      source={{ uri: userContext.avatarURL }}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  ) : (
    <Avatar.Image
      source={require("../../assets/default-2.png")}
      size={50}
      style={{ backgroundColor: "transparent" }}
    />
  );

  const nameComponent = userContext.userInfo?.first_name ? (
    <Title style={styles.title}>
      {userContext.userInfo.first_name} {userContext.userInfo.last_name}
    </Title>
  ) : (
    <Text style={styles.title}>Guest User</Text>
  );

  const titleComponent = userContext.userInfo?.title ? (
    <Caption style={[styles.titleCaption]}>
      {userContext.userInfo.title}
    </Caption>
  ) : (
    <Caption style={styles.titleCaption}>Church Member</Caption>
  );

  const userInfoSection = (
    <>
      <View style={styles.row}>
        <View style={[styles.section]}>
          <Icon color={Colors.grey500} name="map-marker" size={20} />
          <Caption style={[styles.caption, { marginTop: 5 }]}>
            {userContext.userInfo?.location}
          </Caption>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.section}>
          <Caption style={[styles.caption]}>Posts To Date:</Caption>
          <Paragraph style={[styles.paragraph, styles.caption]}>
            {userContext?.userPostCount}
          </Paragraph>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.section}>
          <Caption style={[styles.caption]}>Amount Donated:</Caption>
          <Paragraph style={[styles.paragraph, styles.caption]}>
            ${userContext?.totalDonations}
          </Paragraph>
        </View>
      </View>
    </>
  );

  const signInSection = (
    <>
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => props.navigation.navigate("AuthStack")}
      >
        <View style={[styles.row]}>
          <View style={styles.section}>
            <Caption style={styles.caption}>Sign In/Sign Up</Caption>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  const signOutHandler = () => {
    userContext.signOutHandler();
    props.navigation.replace("AuthStack");
  };

  const signOutButton = (
    <>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          onPress={signOutHandler}
          icon={({ color, size }) => (
            <Ionicons name="exit-outline" color={color} size={size} />
          )}
          label="Sign Out"
        />
      </Drawer.Section>
    </>
  );

  const signInButton = (
    <>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          onPress={() => props.navigation.navigate("AuthStack")}
          icon={({ color, size }) => (
            <Ionicons name="enter-outline" color={color} size={size} />
          )}
          label="Sign In"
        />
      </Drawer.Section>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "center",
              }}
            >
              {imageComponent}
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                {nameComponent}
                {titleComponent}
              </View>
            </View>
            {userContext.auth ? userInfoSection : signInSection}
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => props.navigation.navigate("Home")}
            />
            {userContext?.userInfo && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="account-outline" color={color} size={size} />
                )}
                label="Profile"
                onPress={() => props.navigation.navigate("ProfileStack")}
              />
            )}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="book" color={color} size={size} />
              )}
              label="Library"
              onPress={() => props.navigation.navigate("LibraryStack")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Entypo name="archive" color={color} size={size} />
              )}
              onPress={() => props.navigation.navigate("Services")}
              label="Services"
            />
          </Drawer.Section>
          {/* <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                darkContext.toggleDarkTheme();
              }}
            >
              <View style={styles.preference}>
                <Text>Dark Mode</Text>
                <View pointerEvents="none">
                  <Switch value={darkContext.darkTheme} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>

      {userContext.userInfo ? signOutButton : signInButton}
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 5,
  },
  titleCaption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
