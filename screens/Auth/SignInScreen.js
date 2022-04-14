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
import { Formik } from "formik";
import * as Yup from "yup";
import validator from "validator";

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

  // const signUpHandler = async () => {
  //   setLoading(true);
  //   if (
  //     data.confirmPassword &&
  //     data.isValidConfirmPassword &&
  //     data.email &&
  //     data.isValidEmail &&
  //     data.password &&
  //     data.isValidPassword
  //   ) {
  //     const { data: signUpData, error: signingError } =
  //       await supabase.auth.signUp({
  //         email: data.email,
  //         password: data.password,
  //       });
  //     console.log(signUpData);
  //     if (signingError) {
  //       setFormError(true);
  //       setErrorMessage(signingError.message);
  //     } else {
  //       setSuccess(true);
  //       setData({
  //         email: "",
  //         password: "",
  //         confirmPassword: "",
  //         isValidConfirmPassword: true,
  //         isValidEmail: true,
  //         isValidPassword: true,
  //       });

  //       setSigningUp(false);
  //     }
  //   } else {
  //     setFormError(true);
  //     setErrorMessage("Invalid Input");
  //   }
  //   setLoading(false);
  // };

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
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../../assets/hero.jpg")}
      >
        <Animatable.View animation="fadeInUpBig" style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>login</Text>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={15}>
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
                      <FontAwesome name="user-o" color="#05375a" size={20} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Your Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        onSubmitEditing={() => this.secondTextInput.focus()}
                        blurOnSubmit={false}
                        returnKeyType="next"
                      />
                      {validator.isEmail(values.email) ? (
                        <Animatable.View animation="bounceIn">
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                      ) : null}
                    </View>

                    {1 > values.email.length ||
                      (values.email.length < 6 && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                          <Text style={styles.errorMsg}>
                            Please Enter a Valid Email
                          </Text>
                        </Animatable.View>
                      ))}

                    <Text style={[styles.text_footer, { marginTop: 25 }]}>
                      Password
                    </Text>
                    <View style={styles.action}>
                      <Feather name="lock" color="#05375a" size={20} />
                      <TextInput
                        ref={(input) => this.secondTextInput = input}
                        value={values.password}
                        style={styles.textInput}
                        secureTextEntry={!showPassword}
                        placeholder="Your Password"
                        autoCapitalize="none"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      <TouchableOpacity onPress={() => toggleSecureTextEntry()}>
                        {!showPassword ? (
                          <Feather name="eye-off" color="grey" size={20} />
                        ) : (
                          <Feather name="eye" color="grey" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>

                    {1 > values.password.length ||
                      (values.password.length < 6 && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                          <Text style={styles.errorMsg}>
                            Password must be at least six characters
                          </Text>
                        </Animatable.View>
                      ))}
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Button
                      onPress={handleSubmit}
                      loading={loading}
                      style={styles.button}
                      mode="contained"
                      color={userColors.seaFoam700}
                      icon={"login"}
                    >
                      Log In
                    </Button>
                    <Button
                      style={{ marginBottom: 20 }}
                      mode="contained"
                      color={Colors.blue600}
                      icon="google"
                      onPress={googleAuth}
                    >
                      Sign In With Google
                    </Button>
                  </View>
                </>
              )}
            </Formik>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ textAlign: "center" }}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
              >
                <Text
                  style={{
                    color: userColors.seaFoam500,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Sign Up Now!
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => navigation.replace("AppStack")}
            >
              <Text style={styles.forgotPassword}>Back To App</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Animatable.View>
      </ImageBackground>
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
    alignItems: "center",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: Platform.OS === "android" ? CARD_HEIGHT + 70 : CARD_HEIGHT,
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    paddingHorizontal: 50,
    backgroundColor: Colors.white,
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
    marginTop: 10,
    color: userColors.seaFoam600,
    fontSize: 12,
    fontWeight: "600",
  },
});
