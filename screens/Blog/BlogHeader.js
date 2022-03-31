import {
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";

import { Appbar, Colors } from "react-native-paper";
import { primaryFont } from "../../constants/fonts";

import { SafeAreaView } from "react-native-safe-area-context";
const BlogHeader = ({ navigation, route, back, props, title }) => {


  const formatTitle = route.params?.title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace("---", "-")
    .toLowerCase();

  return (
    <>
      <SafeAreaView
      forceInset={{ top: 'never' }}
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          },
        ]}
      >

        <Appbar.Action
          icon="menu"
          size={30}
          color={Colors.grey900}
          onPress={() => navigation.openDrawer()}
        />
      </SafeAreaView>
    </>
  );
};

export default BlogHeader;

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 10,
    marginBottom: -40,
  },
  title: {
    marginLeft: 20,
    shadowOpacity: 0,
    fontSize: 25,
    fontFamily: primaryFont.extraBold,
  },
});
