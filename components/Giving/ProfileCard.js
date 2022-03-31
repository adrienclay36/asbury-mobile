import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";

import React, { useContext } from "react";
import { UserContext } from "../../store/UserProvider";
import { ActivityIndicator, Avatar, Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
import IconButton from "../ui/IconButton";
import TransactionItem from "./TransactionItem";
import CenteredLoader from "../ui/CenteredLoader";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { SERVER_URL } from "../../constants/serverURL";
import * as WebBrowser from 'expo-web-browser';
import { primaryFont } from "../../constants/fonts";
const IMAGE_SIZE = 100;
const ProfileCard = ({ navigation }) => {
  const userContext = useContext(UserContext);


  const createPortalSession = async () => {
    const response = await axios.post(
      `${SERVER_URL}/create-customer-portal-session`,
      {
        customerID: userContext.customerID,
      }
    );

    if (response.data?.sessionURL) {
      const result = await WebBrowser.openBrowserAsync(
        response.data.sessionURL
      );
    }
    // userContext.checkUser();
    setTimeout(() => {
      navigation.push("GivingHomePage");
    }, 500);

  };


  return (
    <Animatable.View style={{ flex: 1, height: Dimensions.get('window').height }} animation="fadeIn">
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl onRefresh={userContext.refreshTransactions} />
        }
      >
        <View style={styles.container}>
          <Avatar.Image
            source={{ uri: userContext.avatarURL }}
            size={IMAGE_SIZE}
            style={{ backgroundColor: "transparent" }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{userContext.formatName}</Text>
            <View style={styles.moreInfo}>
              <Text style={styles.caption}>Total Donated To Date:</Text>
              {userContext.refreshing ? (
                <ActivityIndicator
                  style={{ marginVertical: 10 }}
                  size="large"
                  color={userColors.seaFoam700}
                />
              ) : (
                <Text style={styles.donationAmount}>
                  ${userContext.totalDonations}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <IconButton
                icon="cash"
                color={userColors.seaFoam600}
                onPress={() => navigation.navigate("OneTimeDonationScreen")}
                text="One Time Donation"
              />
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: Colors.grey300,
                  height: 50,
                }}
              ></View>
              <IconButton
                icon="cash-multiple"
                color={userColors.seaFoam600}
                onPress={
                  userContext.subscribed
                    ? createPortalSession
                    : () => navigation.navigate("NewSubscriptionScreen")
                }
                text={
                  userContext.subscribed
                    ? "Manage Donations"
                    : "Recurring Donations"
                }
              />
            </View>
          </View>
          {userContext.transactions.length === 0 && (
            <Text style={styles.noTransactions}>
              No transactions to show...
            </Text>
          )}
          {userContext.refreshing && <CenteredLoader />}
          {!userContext.refreshing && (
            <View style={styles.transactionContainer}>
              {userContext.transactions.map((payment, index) => (
                <TransactionItem
                  index={index}
                  key={payment.charges.data[0].id}
                  amount={payment.charges.data[0].amount}
                  refunded={payment.charges.data[0].amount_refunded}
                  receiptEmail={payment.charges.data[0].receipt_email}
                  receiptURL={payment.charges.data[0].receipt_url}
                  descriptor={
                    payment.charges.data[0].calculated_statement_descriptor
                  }
                  description={payment.description}
                  status={payment.status}
                  date={payment.created}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Animatable.View>
  );
};

export default ProfileCard;

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
    fontFamily: primaryFont.bold,
    textAlign: "center",
  },
  caption: {
    color: Colors.grey600,
    fontWeight: "500",
    textAlign: "center",
  },
  moreInfo: {
    marginVertical: 10,
    paddingBottom: 5,
  },
  donationAmount: {
    fontSize: 40,
    fontFamily: primaryFont.semiBold,
    textAlign: "center",
    marginTop: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.grey300,
    width: Dimensions.get("window").width / 1.2,
    paddingTop: 10,
    paddingBottom: 10,
  },
  transactionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  noTransactions: {
    fontSize: 20,
    marginTop: 30,
    fontWeight: "600",
  },
  scrollView: {
    height: Dimensions.get('window').height,
  }
});
