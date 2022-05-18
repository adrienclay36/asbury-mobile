import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import React from "react";

const PaddedScrollView = ({
  children,
  padding = 100,
  userStyles = {},
  refreshControlFunction = null,
  refreshing = null,
  containerStyles = {},
  backgroundColor = 'transparent',
}) => {
  return (
    <ScrollView
    contentContainerStyle={containerStyles}
      style={[styles.paddedScrollView, userStyles, { backgroundColor: backgroundColor }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        refreshControlFunction ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshControlFunction()}
          />
        ) : null
      }
    >
      <View style={{ paddingBottom: padding }}>{children}</View>
    </ScrollView>
  );
};

export default PaddedScrollView;

const styles = StyleSheet.create({
  paddedScrollView: {
    height: Dimensions.get("window").height,
    
  },
});
