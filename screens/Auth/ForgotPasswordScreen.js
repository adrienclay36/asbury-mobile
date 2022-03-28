import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { userColors } from "../../constants/userColors";
import { Colors, Button, Portal, Modal } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { primaryFont } from "../../constants/fonts";
const { height, width } = Dimensions.get("window");
import UIModal from "../../components/ui/UIModal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
import * as WebBrowser from "expo-web-browser";
import { GOOGLE_AUTH } from "@env";
import * as AuthSession from "expo-auth-session";
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const CARD_HEIGHT = Dimensions.get("window").height / 2;

const ForgotPasswordScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({
    email: "",
    isValidEmail: true,

  });

  useEffect(() => {
    console.log("SignInScreen: useEffect:: Checking User");
    userContext.checkUser();
  }, []);

  const textInputChange = (val) => {
    if (val.length >= 1) {
      setData({
        ...data,
        email: val,
        checkTextInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        checkTextInputChange: false,
        isValidEmail: false,
      });
    }
  };

  const validateEmail = (val) => {
    if (emailRegex.test(val.trim().toLowerCase())) {
      setData({
        ...data,
        isValidEmail: true,
        checkTextInputChange: true,
      });
    } else {
      setData({
        ...data,
        isValidEmail: false,
        checkTextInputChange: false,
      });
    }
  };

  const resetPasswordHandler = async () => {
    setLoading(true);
    if (data.email) {
      const { data: resetPassData, error } = await supabase.auth.api.resetPasswordForEmail(
        data.email
      );
      if (!error) {
        console.log(
          "Success:: resetPasswordHandler:: Reset Password Email Sent"
        );
        setSuccess(true);
        setData({
          ...data,
          email: '',
        })
      } else {
        setErrorMessage(error.message);
        setFormError(true);
      }
    } 
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <UIModal
        type="error"
        text={errorMessage}
        showModal={formError}
        dismissModal={() => setFormError(false)}
      />
      <UIModal
        type="success"
        text="You will receive an email containing further instructions for resetting your password!"
        showModal={success}
        dismissModal={() => setSuccess(false)}
      />
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../../assets/hero.jpg")}
      >
        <View style={styles.card}>
          <View style={styles.form}>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Your Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={data.email}
                onChangeText={(text) => textInputChange(text)}
                onEndEditing={(e) => validateEmail(e.nativeEvent.text)}
              />
              {data.checkTextInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>

            {!data.isValidEmail && (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Please Enter a Valid Email</Text>
              </Animatable.View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={resetPasswordHandler}
              disabled={
                !data.isValidEmail ||
                loading
              }
              loading={loading}
              style={styles.button}
              mode="contained"
              color={userColors.seaFoam700}
              icon={"login"}
            >
              Reset Password
            </Button>
          </View>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <Text style={styles.forgotPassword}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomTab: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: Colors.white,
    flex: 1,
    width: width,
    height: height * 0.3,
  },
  text: {
    padding: 30,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: Platform.OS === "android" ? CARD_HEIGHT + 50 : CARD_HEIGHT,
    justifyContent: "center",
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 25,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  title: {
    fontFamily: primaryFont.bold,
    color: Colors.grey700,
    fontSize: 50,
    textAlign: "center",
    marginVertical: 30,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    paddingHorizontal: 50,
    backgroundColor: Colors.white,
    marginVertical: 30,
  },
  formControl: {
    marginBottom: 30,
  },
  button: {
    width: "60%",
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    height: Dimensions.get("window").height * 0.2,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  modalTitle: {
    fontFamily: primaryFont.semiBold,
    fontSize: 20,
  },
  errorText: {
    fontFamily: primaryFont.bold,
    marginBottom: 20,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    marginBottom: 15,
  },
  action: {
    flexDirection: "row",

    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,

    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  forgotPassword: {
    textAlign: "center",
    marginTop: 20,
    color: userColors.seaFoam600,
    fontSize: 12,
    fontWeight: "600",
  },
});
