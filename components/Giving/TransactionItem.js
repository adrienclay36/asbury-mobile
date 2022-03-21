import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import React, { useContext } from "react";
import { Colors } from "react-native-paper";
import { userColors } from "../../constants/userColors";
const { width, height } = Dimensions.get("window");
import { UserContext } from "../../store/UserProvider";
import Ionicons from "react-native-vector-icons/Ionicons";

const ICON_SIZE = 30;
const TransactionItem = ({
  amount,
  receiptEmail,
  receiptURL,
  descriptor,
  description,
  status,
  date,
  index,
}) => {
  const userContext = useContext(UserContext);
  const formatDate = new Date(date * 1000).toLocaleDateString("en-US");

  const iconComponent =
    status === "succeeded" ? (
      <Ionicons
        style={styles.icon}
        color={Colors.green800}
        size={ICON_SIZE}
        name="checkmark-circle"
      />
    ) : (
      <Ionicons
        style={styles.icon}
        size={ICON_SIZE}
        name="md-close-circle-outline"
      />
    );

    const linkToReceipt = async () => {
        const result = await WebBrowser.openBrowserAsync(receiptURL);
    }
  return (
    <TouchableOpacity onPress={linkToReceipt}>
      <View
        style={[
          styles.container,
          {
            borderBottomWidth:
              index !== userContext.transactions.length - 1 ? 0.5 : 0,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {iconComponent}
          <View>
            <Text style={styles.date}>{formatDate}</Text>
            <Text style={styles.descriptor}>{descriptor}</Text>
            <Text>{description}</Text>
          </View>
        </View>
        <Text style={styles.amount}>${amount / 100}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderColor: Colors.grey300,
    width: width - 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.grey200,
  },
  date: {
    fontWeight: "600",
    color: userColors.seaFoam600,
  },
  descriptor: {
    fontWeight: "500",
  },
  amount: {
    fontWeight: "600",
  },
  icon: {
    marginRight: 10,
  },
});
