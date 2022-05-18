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
  KeyboardAvoidingView,
  Image,
} from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import React, { useState, useContext, useEffect, useRef } from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import validator from "validator";
import PaddedScrollView from "../../components/ui/PaddedScrollView";

const CARD_HEIGHT = Dimensions.get("window").height / 1.3;

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required("Please Enter A Valid Email Address"),
  password: Yup.string()
    .required()
    .min(6, "Passwords must be at least 6 characters"),
});

const SignInScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    console.log("SignInScreen: useEffect:: Checking User");
    userContext.checkUser();
  }, []);

  const loginHandler = async (email, password) => {
    setLoading(true);

    const { data: signInData, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if (!error) {
      navigation.replace("AppStack");
      return;
    } else {
      setFormError(true);
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const googleAuth = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });

    const fullURI = `${GOOGLE_AUTH}&redirect_to=${redirectUri}`;
    const response = await AuthSession.startAsync({
      authUrl: fullURI,
      returnUrl: redirectUri,
    });

    if (response.params?.refresh_token) {
      const { user, session, error } = await supabase.auth.signIn({
        refreshToken: response.params?.refresh_token,
      });

      navigation.replace("AppStack");
    }
  };

  const toggleSecureTextEntry = () => {
    setShowPassword(!showPassword);
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
        text="Sign Up Successful! You will receive an email containing a confirmation link. Come back to sign in after you've followed this link!"
        showModal={success}
        dismissModal={() => setSuccess(false)}
      />
      <Image
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../../assets/hero.jpg")}
      />
      <PaddedScrollView containerStyles={{ justifyContent: "center", flex: 1 }}>
        <Animatable.View animation="fadeInUpBig">
          <View style={styles.titleContainer}>
            <Text style={styles.title}>asbury.umc</Text>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30}>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginFormSchema}
              validateOnMount={true}
              onSubmit={(values, actions) => {
                loginHandler(values.email, values.password);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  <View style={styles.form}>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Your Email"
                        placeholderTextColor={Colors.grey200}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef?.current?.focus()}
                      />
                      {/* {validator.isEmail(values.email) ? (
                        <Animatable.View animation="bounceIn">
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                      ) : null} */}
                    </View>

                    <Text style={[styles.text_footer, { marginTop: 25 }]}>
                      Password
                    </Text>
                    <View style={styles.action}>
                      <TextInput
                        value={values.password}
                        placeholderTextColor={Colors.grey200}
                        style={styles.textInput}
                        secureTextEntry={!showPassword}
                        placeholder="Your Password"
                        autoCapitalize="none"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        ref={passwordRef}
                      />
                      <TouchableOpacity onPress={() => toggleSecureTextEntry()}>
                        {!showPassword ? (
                          <Feather name="eye-off" color="white" size={20} />
                        ) : (
                          <Feather name="eye" color="white" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>

                    {!loading&& <TouchableOpacity
                      style={{ justifyContent: "flex-end", alignItems: "center", marginTop: 15, }}
                      onPress={() =>
                        navigation.navigate("ForgotPasswordScreen")
                      }
                    >
                      <Text style={styles.forgotPassword}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>}

                    {!loading && (
                      <View style={{ marginVertical: 10, width: "100%" }}>
                        <CustomButton
                          text="Log In"
                          mode="outlined"
                          onPress={handleSubmit}
                          loading={loading}
                        />
                        <CustomButton
                          text="Sign In With Google"
                          onPress={googleAuth}
                          backgroundColor={Colors.blue600}
                          leftIcon={
                            <FontAwesome
                              name="google"
                              size={20}
                              color="white"
                            />
                          }
                        />
                      </View>
                    )}
                  </View>
                </>
              )}
            </Formik>

            {!loading && <View style={{ marginVertical: 10 }}>
              <Text style={{ textAlign: "center", color: "white" }}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
              >
                <Text
                  style={{
                    color: "white",
                    marginVertical: 10,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Sign Up Now!
                </Text>
              </TouchableOpacity>
            </View>}
            {!loading && <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => navigation.replace("AppStack")}
            >
              <Text style={styles.forgotPassword}>Back To App</Text>
            </TouchableOpacity>}
          </KeyboardAvoidingView>
        </Animatable.View>
      </PaddedScrollView>
    </View>
  );
};

export default SignInScreen;

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
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },

  title: {
    fontFamily: primaryFont.bold,
    color: "white",
    fontSize: 35,
    textAlign: "center",
    marginVertical: 30,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    paddingHorizontal: 50,
    marginBottom: 30,
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
    color: "white",
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
    fontSize: 16,
    color: "white",
  },
  errorMsg: {
    color: Colors.white,
    fontSize: 14,
  },
  forgotPassword: {
    color: 'white',
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
  },
});
