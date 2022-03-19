import { StyleSheet, View } from "react-native";
import React, { useState, useContext } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { UserContext } from "../../store/UserProvider";

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


  const titleComponent = userContext.userInfo?.title ? <Caption style={styles.caption}>{userContext.userInfo.title}</Caption> : <Caption style={styles.caption}>Church Member</Caption>


  const signOutHandler = () => {
      userContext.signOutHandler();
      props.navigation.replace("AuthStack");
  };

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
              {/* <Avatar.Image
                source={}
                size={50}
              /> */}
              {imageComponent}
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                {nameComponent}
                {titleComponent}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Caption style={[styles.caption, { marginLeft: 5 }]}>Posts To Date:</Caption>
                <Paragraph style={[styles.paragraph, styles.caption, { marginLeft: 5, }]}>
                  {userContext.userPostCount}
                </Paragraph>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => props.navigation.navigate("Home")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => props.navigation.navigate("ProfileStack")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              label="Bookmarks"
              onPress={() => props.navigation.navigate("BookmarkScreen")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons
                  name="md-settings-outline"
                  color={color}
                  size={size}
                />
              )}
              onPress={() => props.navigation.navigate("SettingsScreen")}
              label="Settings"
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
      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          onPress={signOutHandler}
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
        />
      </Drawer.Section>
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
