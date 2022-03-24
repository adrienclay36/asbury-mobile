import { Dimensions, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import { supabase } from "../../supabase-service";
import { getSignedUrl } from "../../supabase-util";
import CenteredLoader from "../../components/ui/CenteredLoader";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';

const ProgramsHomeScreen = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);

  const getFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("programs")
      .list("programs", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    const link = await getSignedUrl("programs", `programs/${data[0].name}`);
    setDownloadLink(link);
    setLoading(false);
  };
  useEffect(() => {
    getFiles();
  }, []);


  const openURL = () => {
      if(downloadLink) {
          WebBrowser.openBrowserAsync(downloadLink);
      }
  }

  if (loading) {
    return <CenteredLoader />;
  }

  return (
      <View>

      <Text style={{ textAlign: "center", marginVertical: 10 }}>
        Click To Download
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        Pull Down To Refresh
      </Text>
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getFiles()} />} style={{ height: Dimensions.get('window').height}}>
        <TouchableOpacity onPress={openURL}>
      <Card>
          <View style={styles.programContainer}>
            <Text style={styles.title}>Weekly Program</Text>
            <Ionicons name="ios-document-attach-outline" size={30} />
          </View>
      </Card>
        </TouchableOpacity>
    </ScrollView>
      </View>
  );
};

export default ProgramsHomeScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  programContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
