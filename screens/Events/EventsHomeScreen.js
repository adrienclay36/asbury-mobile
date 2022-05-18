import {
  StyleSheet,
  Text,
  View,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useContext, useRef } from "react";
import { primaryFont } from "../../constants/fonts";
import Carousel from "react-native-snap-carousel";
import EventScreenCard from "../../components/ui/EventScreenCard";
import EventItem from "./EventItem";
const { width, height } = Dimensions.get("window");
import DrawerHeader from "../../components/ui/DrawerHeader";
import RegularAnimation from "../../components/ui/RegularAnimation";
import { EventsContext } from '../../store/EventsProvider';
const EventsHomeScreen = ({ route, navigation }) => {
  const eventContext = useContext(EventsContext);
  const scrollY = useRef(new Animated.Value(0)).current;

  if (eventContext?.loading) {
    return (
      <>
        <RegularAnimation
          source={require("../../loaders/dotloader.json")}
          loop={true}
        />
      </>
    );
  }

  const renderCardItem = (itemData) => {
    return (
      <EventScreenCard
        date={itemData.item.date}
        start={itemData.item.start}
        end={itemData.item.end}
        title={itemData.item.summary}
        image={require("../../assets/event-item-hero.jpg")}
        navigation={navigation}
      />
    );
  };
  return (
    <>
      <DrawerHeader />
      <View>
        <Text style={styles.title}>Upcoming</Text>
        <View>
          <Carousel
            sliderWidth={width}
            itemWidth={width * 0.9 + 40}
            data={eventContext?.events.slice(0, 3)}
            renderItem={renderCardItem}
            layout="stack"
          />
        </View>
        <Animated.FlatList
          refreshing={eventContext?.loading}
          refreshControl={<RefreshControl onRefresh={() => eventContext?.getEvents()} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          data={eventContext?.events.slice(3)}
          renderItem={({ item, index }) => (
            <EventItem
              navigation={navigation}
              scrollY={scrollY}
              index={index}
              date={item.date}
              start={item.start}
              end={item.end}
              summary={item.summary}
            />
          )}
        />
      </View>
    </>
  );
};

export default EventsHomeScreen;

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 30,
    fontSize: 20,
    fontFamily: primaryFont.semiBold,
  },
});
