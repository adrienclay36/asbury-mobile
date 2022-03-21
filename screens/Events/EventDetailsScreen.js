import { StyleSheet, Text, View, Platform, Linking, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { getMonthFromDateCode } from "../../helpers/dateTimes";
import { Appbar, Colors } from "react-native-paper";
import EventDetailsHeader from "./EventDetailsHeader";
import { primaryFont } from "../../constants/fonts";
import { userColors } from "../../constants/userColors";
import MapView, { Marker, Callout } from "react-native-maps";
import { GOOGLE_API } from "@env";
import { decode } from "../../helpers/mapDecode";
import * as Location from "expo-location";

import axios from "axios";
import CenteredLoader from "../../components/ui/CenteredLoader";

const MODE = "driving";

const ASBURY_COORDINATE = {
  latitude: 35.116122519024906,
  longitude: -106.52838891558294,
};

const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
const latLng = `${ASBURY_COORDINATE.latitude},${ASBURY_COORDINATE.longitude}`;
const label = "Asbury United Methodist Church";
const openMapsUrl = Platform.select({
  ios: `${scheme}${label}@${latLng}`,
  android: `${scheme}${latLng}(${label})`,
});


const EventDetailsScreen = ({ navigation, route }) => {
  const { formatStart, formatEnd, day, monthText, summary } = route?.params;
  const [polyline, setPolyline] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [destination, setDestination] = useState({
    latitude: ASBURY_COORDINATE.latitude,
    longitude: ASBURY_COORDINATE.longitude,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: ASBURY_COORDINATE.latitude,
    longitude: ASBURY_COORDINATE.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: .1,
  });

  // transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@... to an array of coordinates

  const verifyPermissions = async () => {
    let result = await Location.requestForegroundPermissionsAsync();
    if (result.status === "granted") {
      return true;
    } else {
      Alert.alert(
        "Location Error",
        "You must grant location permissions to utilize location features.",
        [
          {
            text: "Allow in Settings",
            onPress: () => Linking.openURL("app-settings:"),
          },
          { text: "Cancel", style: "destructive" },
        ]
      );
      return false;
    }
  };

  const getLocationHandler = async () => {
    setGettingLocation(true);
    const permissions = await verifyPermissions();
    if (permissions) {
      try {
        const fetchedLocation = await Location.getCurrentPositionAsync({
          timeout: 5000,
        });
        setUserLocation({
          latitude: fetchedLocation.coords.latitude,
          longitude: fetchedLocation.coords.longitude,
        });
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fetchedLocation.coords.latitude},${fetchedLocation.coords.longitude}&destination=${ASBURY_COORDINATE.latitude},${ASBURY_COORDINATE.longitude}&key=${GOOGLE_API}&mode=${MODE}`;
        const response = await axios.get(url);
        if(response.data.routes.length) {
          setPolyline({
            coords: decode(response.data.routes[0].overview_polyline.points),
          })
        }
      } catch (err) {
        Alert.alert(
          "Could not get location!",
          "Please try again later or pick a location on the map!",
          [{ text: "Okay" }]
        );
      }
    }
    setGettingLocation(false);
  };

  useEffect(() => {
    getLocationHandler();
  }, []);

  const month = getMonthFromDateCode(monthText);


  const openInMapsHandler = async () => {
    Alert.alert("Open In Maps?", "Do you want to open this location in maps?", [
      { text: "Open", onPress: () => Linking.openURL(openMapsUrl) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }




  return (
    <View style={{ flex: 1 }}>
      <EventDetailsHeader navigation={navigation} route={route} />
      <View style={styles.eventContainer}>
        <Text style={[styles.header, { color: userColors.seaFoam700 }]}>
          {summary}
        </Text>
        <Text style={styles.header}>
          {formatStart} - {formatEnd}{" "}
        </Text>
        <Text style={styles.header}>
          {day} {month}, {new Date().getFullYear()}
        </Text>
      </View>

      {gettingLocation ? <CenteredLoader/> : <MapView
      onLongPress={openInMapsHandler}
        initialRegion={mapRegion}
        collapsable={false}
        style={styles.mapContainer}
      >
        {userLocation.latitude && userLocation.longitude && <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude}}/>}
        {polyline && userLocation.latitude && userLocation.longitude && <MapView.Polyline coordinates={[
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          ...polyline.coords,
          { latitude: mapRegion.latitude, longitude: mapRegion.longitude},
        ]} strokeWidth={4} strokeColor={Colors.blue400}  />}
        <Marker
          onLongPress={openInMapsHandler}
          coordinate={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
          }}
        >
          <Callout tooltip onLongPress={openInMapsHandler}>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>Asbury UMC</Text>
                <Text>10000 Candelaria Road NE, 87112</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>
      </MapView>}
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  eventContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 10,
    borderColor: Colors.grey200,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: primaryFont.semiBold,
    textTransform: "uppercase",
    marginVertical: 5,
  },
  mapContainer: {
    flex: 1,
  },
  bubble: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderColor: Colors.grey300,
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: Colors.white,
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: Colors.grey300,
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
});
