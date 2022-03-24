import { Dimensions, StyleSheet, ScrollView, View, RefreshControl, Text } from "react-native";
import React, { useEffect, useState } from "react";
import RenderHtml from "react-native-render-html";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { supabase } from "../../supabase-service";
import CenteredLoader from "../../components/ui/CenteredLoader";
import WebView from "react-native-webview";
import { Colors } from "react-native-paper";
const { height, width } = Dimensions.get("window");
import * as Animatable from 'react-native-animatable'
import { primaryFont } from "../../constants/fonts";
const LivestreamHomePage = React.memo(() => {
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const getSource = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("live_source").select();
    if (data.length > 0) {
      const withDiv = "<div class='width:'90%''>" + data[0].source + "</div>";
      setSource(withDiv);
    }

    setLoading(false);
  };

  useEffect(() => {
    getSource();
  }, []);

  if (loading) {
    return <CenteredLoader />;
  }

  const htmlSource = { html: source };

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };
  const tagStyles = {
    iframe: {
      width: width / 2,
      
    }
  }

  return (
    <Animatable.View style={{ height: height }} animation="fadeInUpBig">
      <Text style={{ textAlign: 'center', marginVertical: 5}}>Pull Down To Refresh</Text>
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getSource()} />} contentContainerStyle={{ justifyContent: 'center', alignItem: 'center'}} style={styles.contentContainer}>
     <View style={styles.videoPadding}>

        <RenderHtml
          renderers={renderers}
          WebView={WebView}
          customHTMLElementModels={customHTMLElementModels}
          source={htmlSource}
          contentWidth={width}
          tagsStyles={tagStyles}
          />
          
        </View>
    
    </ScrollView>
          </Animatable.View>
  );
});

export default LivestreamHomePage;

const styles = StyleSheet.create({
  contentContainer: {
    height: height * .2,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  videoPadding: {
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
     marginTop: 50,
     fontFamily: primaryFont.regular,
     fontSize: 18,
  }
});
