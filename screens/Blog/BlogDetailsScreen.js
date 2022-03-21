import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { primaryFont } from "../../constants/fonts";
import { Avatar } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import RenderHtml from "react-native-render-html";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import WebView from "react-native-webview";

const { height, width } = Dimensions.get("window");
const BlogDetailsScreen = ({ navigation, route }) => {
  const { title, author, postContent, userID, image, postDate, avatarURL } =
    route?.params;
  const formatDate = new Date(postDate).toLocaleDateString("en-US");
  let imageComponent;
  if (image.includes("http")) {
    imageComponent = <Image source={{ uri: image }} style={styles.image} />;
  } else {
    imageComponent = (
      <Image
        source={require("../../assets/blog-default.png")}
        style={styles.image}
      />
    );
  }

  const source = { html: postContent };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
    iframe: {
      scalePageToFit: false,
    }
  };

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const tagsStyles = {
    figure: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    img: { width: width - 200 },
  };

  return (
    <ScrollView>
      {imageComponent}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.postData}>
        <View style={styles.authorBox}>
          <Avatar.Image source={{ uri: avatarURL }} size={60} />
          <View style={styles.textData}>
            <Text style={styles.author}>{author}</Text>
            <Text style={styles.date}>{formatDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <RenderHtml
          renderers={renderers}
          WebView={WebView}
          customHTMLElementModels={customHTMLElementModels}
          tagsStyles={tagsStyles}
          renderersProps={renderersProps}
          source={source}
          contentWidth={width}
        />
      </View>
    </ScrollView>
  );
};

export default BlogDetailsScreen;

const styles = StyleSheet.create({
  image: {
    height: height * 0.3,
    width: width,
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: primaryFont.semiBold,
    fontSize: 30,
    textAlign: "center",
    marginVertical: 18,
    marginHorizontal: 15,
  },
  postData: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  authorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textData: {
    marginLeft: 10,
  },
  author: {
    fontFamily: primaryFont.medium,
  },
  date: {
    fontFamily: primaryFont.semiBold,
    color: userColors.seaFoam600,
  },
  contentContainer: {
    marginHorizontal: 15,
  },
});
