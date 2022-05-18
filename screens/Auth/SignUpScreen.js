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
import React, { useState, useContext, useEffect, useRef } from "react";
import { userColors } from "../../constants/userColors";
import { Colors, Button, Portal, Modal } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { primaryFont } from "../../constants/fonts";
const { height, width } = Dimensions.get("window");
import UIModal from "../../components/ui/UIModal";
import Feather from "react-native-vector-icons/Feather";
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
import { Formik } from "formik";
import * as Yup from "yup";
import validator from "validator";
import PaddedScrollView from "../../components/ui/PaddedScrollView";

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required("Please Enter A Valid Email Address"),
  password: Yup.string()
    .required()
    .min(6, "Passwords must be at least 6 characters"),
  confirmPassword: Yup.string().when("password", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf([Yup.ref("password")], "Passwords Must Match"),
  }),
  firstName: Yup.string().required().min(1, "Please enter your first name."),
  lastName: Yup.string().required().min(1, "Please enter your last name"),
});

const SignUpScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    console.log("SignInScreen: useEffect:: Checking User");
    userContext.checkUser();
  }, []);

  const signUpHandler = async (
    email,
    password,
    firstName,
    lastName,
    resetForm
  ) => {
    setLoading(true);

    const { data: existingUser, error: noUser } = await supabase
      .from("users")
      .select()
      .match({ email });
    if (existingUser.length > 0) {
      setErrorMessage("This user already exists!");
      setFormError(true);
      setLoading(false);
      return;
    } else if (noUser) {
      setErrorMessage(noUser.message);
      setFormError(true);
      setLoading(false);
      return;
    }
    const { data: signUpData, error: signingError } =
      await supabase.auth.signUp({
        email: email,
        password: password,
      });

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .match({ email });

    if (userData) {
      const userInfo = userData[0];
      const { data: successData, error: updateUserError } = await supabase
        .from("users")
        .update({ first_name: firstName, last_name: lastName })
        .match({ id: userInfo.id });

      if (userError) {
        setFormError(true);
        setErrorMessage(updateUserError.message);
        setLoading(false);
        return;
      }
    }

    if (signingError) {
      setFormError(true);
      setErrorMessage(signingError.message);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setSuccess(true);
      setSigningUp(false);
      resetForm();
    }
  };

  const toggleSecureTextEntry = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={60} style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
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
        dismissModal={() => {
          navigation.navigate("SignInScreen");
        }}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>sign up</Text>
      </View>
      <View style={styles.card}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
          }}
          validationSchema={loginFormSchema}
          validateOnMount={true}
          onSubmit={(values, actions) => {
            signUpHandler(
              values.email,
              values.password,
              values.firstName,
              values.lastName,
              actions.resetForm
            );
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
                <View
                  behavior="position"
                  keyboardVerticalOffset={50}
                  style={styles.formControl}
                >
                  <Text style={styles.text_footer}>First Name</Text>
                  <View style={styles.action}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="First Name"
                      autoCapitalize="words"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      placeholderTextColor={Colors.grey600}
                      onSubmitEditing={() => lastNameRef?.current?.focus()}
                    />
                    {!errors.firstName ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="green" size={20} />
                      </Animatable.View>
                    ) : null}
                  </View>
                </View>

                <View behavior="position" style={styles.formControl}>
                  <Text style={styles.text_footer}>Last Name</Text>
                  <View style={styles.action}>
                    <TextInput
                      ref={lastNameRef}
                      style={styles.textInput}
                      placeholder="Last Name"
                      autoCapitalize="words"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      blurOnSubmit={false}
                      placeholderTextColor={Colors.grey600}
                      onSubmitEditing={() => emailRef?.current?.focus()}
                      returnKeyType="next"
                    />
                    {!errors.lastName ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="green" size={20} />
                      </Animatable.View>
                    ) : null}
                  </View>
                </View>

                <View behavior="position" style={styles.formControl}>
                  <Text style={styles.text_footer}>Email</Text>
                  <View style={styles.action}>
                    <TextInput
                      ref={emailRef}
                      style={styles.textInput}
                      placeholder="Your Email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      returnKeyType="next"
                      onBlur={handleBlur("email")}
                      blurOnSubmit={false}
                      placeholderTextColor={Colors.grey600}
                      onSubmitEditing={() => passwordRef?.current?.focus()}
                    />
                    {validator.isEmail(values.email) ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="green" size={20} />
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
                </View>

                <View
                  behavior="position"
                  keyboardVerticalOffset={30}
                  style={styles.formControl}
                >
                  <Text style={[styles.text_footer]}>Password</Text>
                  <View style={styles.action}>
                    <TextInput
                      ref={passwordRef}
                      value={values.password}
                      style={styles.textInput}
                      secureTextEntry={!showPassword}
                      placeholder="Your Password"
                      autoCapitalize="none"
                      placeholderTextColor={Colors.grey600}
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
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.button}
                  mode="contained"
                  color={userColors.seaFoam700}
                  icon={"login"}
                >
                  Create Account
                </Button>
              </View>
            </>
          )}
        </Formik>
        <View>
          <Text style={{ textAlign: "center" }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <Text
              style={{
                color: userColors.seaFoam500,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {" "}
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
    width: "100%",
    borderRadius: 25,
    padding: 5,
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
    marginBottom: 10,
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
    color: "black",
    fontFamily: primaryFont.regular,
    fontSize: 14,
  },
  action: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    marginVertical: 15,
    width: "100%",
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
    color: "#05375a",
    fontSize: 16,
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
