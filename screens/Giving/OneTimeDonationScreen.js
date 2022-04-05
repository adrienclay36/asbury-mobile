import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import OneTimeDonationHeader from "./OneTimeDonationHeader";
import { Colors } from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as WebBrowser from 'expo-web-browser';
import axios from "axios";
import { SERVER_URL } from "../../constants/serverURL";
import { UserContext } from "../../store/UserProvider";
import * as Animatable from 'react-native-animatable';
const OneTimeDonationScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const [amount, setAmount] = useState({
    value: null,
    isValid: true,
    amountChanged: false,
  });
  const [loading, setLoading] = useState(false);

  const submitPaymentHandler = async () => {
    setLoading(true);
    const checkoutAmount = parseInt(amount.value);
    if(checkoutAmount > 0) {

      try {
        const response = await axios.post(
          `${SERVER_URL}/checkout-session-with-amount`,
          { amount: parseInt(amount.value), customerID: userContext.userInfo.customer_id }
        );
        if(response.data) {
          if(response.data?.sessionURL){
            const result = await WebBrowser.openBrowserAsync(response.data.sessionURL);

            setTimeout(() => {
              navigation.replace("GivingHomePage");
            }, 100);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    setLoading(false);
  };

  const amountChangeHandler = (text) => {

    if (parseInt(text) <= 0 || text.length === 0) {
      setAmount({
        value: text,
        isValid: false,
        amountChanged: false,
      });
    } else {
      setAmount({
        value: text,
        isValid: true,
        amountChanged: true,
      });
    }
  };

  return (
    <View style={{ flex: 1, height: Dimensions.get("window").height }}>
      <StatusBar style={Platform.OS === "android" ? "dark" : "light"} />
      <OneTimeDonationHeader
        navigation={navigation}
        submitPaymentHandler={submitPaymentHandler}
        loading={loading}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.amountContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              value={amount.value}
              onChangeText={(text) => amountChangeHandler(text)}
              returnKeyType="done"
              style={styles.amount}
              placeholderTextColor={Colors.grey400}
              placeholder="100"
              keyboardType="number-pad"
            />
          </View>
            {!amount.isValid && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorText}>
                  Amount Must Be Greater than $0
                </Text>
              </Animatable.View>
            )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default OneTimeDonationScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  amount: {
    borderBottomColor: Colors.grey300,
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 50,
    width: "50%",
    textAlign: "center",
  },
  dollarSign: {
    fontSize: 40,
  },
  formControl: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 10,
    marginVertical: 10,
  },
  textInput: {
    fontSize: 16,
    paddingLeft: 10,
    width: "90%",
    borderBottomColor: Colors.grey300,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  errorText: {
    color: Colors.red600,
    textAlign: 'center',
  },
  cityState: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shortInput: {
    fontSize: 16,
    paddingLeft: 10,
    width: "90%",
    borderBottomColor: Colors.grey300,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});
