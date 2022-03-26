import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, ScrollView, TextInput, Platform } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { userColors } from "../../constants/userColors";
import { Colors, Button, Portal, Modal } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { primaryFont } from "../../constants/fonts";
const { height, width } = Dimensions.get("window");
import UIModal from '../../components/ui/UIModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_AUTH } from '@env';
import * as AuthSession from 'expo-auth-session';
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const CARD_HEIGHT = Dimensions.get('window').height / 1.3;

const SignInScreen = ({ navigation, route }) => {
  const userContext = useContext(UserContext);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    checkTextInputChange: false,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  })

  useEffect(() => {
    console.log("SignInScreen: useEffect:: Checking User");
    userContext.checkUser()
  }, [])


  const confirmPassword = (
    <>
      <Text style={[styles.text_footer, { marginTop: 25 }]}>Confirm Password</Text>
      <View style={styles.action}>
        <Feather name="lock" color="#05375a" size={20} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={data.confirmSecureTextEntry}
          placeholder="Your Password"
          autoCapitalize="none"
          onChangeText={(text) => handleConfirmPasswordChange(text)}
        />
        <TouchableOpacity onPress={() => updateConfirmSecureTextEntry()}>
          {data.confirmSecureTextEntry ? (
            <Feather name="eye-off" color="grey" size={20} />
          ) : (
            <Feather name="eye" color="grey" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {!data.isValidConfirmPassword && (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Passwords Must Match
          </Text>
        </Animatable.View>
      )}
    </>
  );

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

   const handlePasswordChange = (val) => {
     if (val.trim().length >= 6) {
       setData({
         ...data,
         password: val,
         isValidPassword: true,
       });
     } else {
       setData({
         ...data,
         password: val,
         isValidPassword: false,
       });
     }
   };

   const handleConfirmPasswordChange = (val) => {
     if (val.trim() === data.password) {
       setData({
         ...data,
         confirmPassword: val,
         isValidConfirmPassword: true,
       });
     } else {
       setData({
         ...data,
         confirmPassword: val,
         isValidConfirmPassword: false,
       });
     }
   };

    const updateSecureTextEntry = () => {
      setData({
        ...data,
        secureTextEntry: !data.secureTextEntry,
      });
    };

    const updateConfirmSecureTextEntry = () => {
      setData({
        ...data,
        confirmSecureTextEntry: !data.confirmSecureTextEntry,
      });
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

   
 

  const loginHandler = async () => {
    setLoading(true);
    if(data.isValidEmail && data.isValidPassword) {
      const { data: signInData, error } = await supabase.auth.signIn({ email: data.email, password: data.password})
      if(!error) {
        navigation.replace("AppStack");
        return;
      } else {
        setFormError(true);
        setErrorMessage(error.message);
      }
    }

    setLoading(false);
  }

  const signUpHandler = async () => {
    setLoading(true);
    if(data.confirmPassword && data.isValidConfirmPassword && data.email && data.isValidEmail && data.password && data.isValidPassword){
      const { data: signUpData, error: signingError } = await supabase.auth.signUp({ email: data.email, password: data.password });
      console.log(signUpData);
      if(signingError){
        setFormError(true);
        setErrorMessage(signingError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigation.replace("AppStack");
        }, 3000)
      }
    } else {
      setFormError(true);
      setErrorMessage("Invalid Input");
    }
    setLoading(false);

  }


  const switchFormHandler = () => {
    setSigningUp(!signingUp);
    setData({
      ...data,
      password: '',
      email: '',
      confirmPassword: '',
      isValidConfirmPassword: true,
      isValidEmail: true,
      isValidPassword: true,
    })
  }

  const googleAuth = async () => {
    
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });
    
    const fullURI = `${GOOGLE_AUTH}&redirect_to=${redirectUri}`;
    const response = await AuthSession.startAsync({
      authUrl: fullURI,
      returnUrl: redirectUri,
    });

    const { user, session, error } = await supabase.auth.signIn({
      refreshToken: response.params?.refresh_token,
    });

    navigation.replace("AppStack");
  }
    
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
      {/* <Portal>
        <Modal contentContainerStyle={styles.modalContainer} visible={formError} onDismiss={() => setFormError(false)}>
          <Text style={styles.modalTitle}>{errorMessage}</Text>
        </Modal>
      </Portal> */}
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../../assets/hero.jpg")}
      >
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            {signingUp ? (
              <Text style={styles.title}>sign up</Text>
            ) : (
              <Text style={styles.title}>login</Text>
            )}
          </View>
          <ScrollView>
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
                  <Text style={styles.errorMsg}>
                    Please Enter a Valid Email
                  </Text>
                </Animatable.View>
              )}

              <Text style={[styles.text_footer, { marginTop: 25 }]}>
                Password
              </Text>
              <View style={styles.action}>
                <Feather name="lock" color="#05375a" size={20} />
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={data.secureTextEntry}
                  placeholder="Your Password"
                  autoCapitalize="none"
                  onChangeText={(text) => handlePasswordChange(text)}
                />
                <TouchableOpacity onPress={() => updateSecureTextEntry()}>
                  {data.secureTextEntry ? (
                    <Feather name="eye-off" color="grey" size={20} />
                  ) : (
                    <Feather name="eye" color="grey" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              {!data.isValidPassword && (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>
                    Password must be at least six characters
                  </Text>
                </Animatable.View>
              )}

              {signingUp && confirmPassword}
            </View>
            <View style={styles.buttonContainer}>
              {!signingUp && (
                <Button
                  onPress={loginHandler}
                  disabled={
                    !data.isValidEmail ||
                    !data.isValidPassword ||
                    userContext.authenticating
                  }
                  loading={loading}
                  style={styles.button}
                  mode="contained"
                  color={userColors.seaFoam700}
                  icon={"login"}
                  >
                  Log In
                </Button>
              )}
              <Button style={{ marginBottom: 20, }} mode="contained" color={Colors.blue600} icon="google" onPress={googleAuth}>Sign In With Google</Button>
              {signingUp && (
                <Button
                  loading={loading}
                  onPress={signUpHandler}
                  style={styles.button}
                  mode="contained"
                  color={userColors.seaFoam700}
                  icon="transfer-up"
                >
                  Sign Up
                </Button>
              )}
              <Button color={userColors.seaFoam700} onPress={switchFormHandler}>
                {!signingUp ? "Sign Up" : "Log In"}
              </Button>
            </View>

            <Button
              onPress={() => navigation.replace("AppStack")}
              style={{ marginTop: 30 }}
              mode="outlined"
              color={userColors.seaFoam700}
            >
              Back To App
            </Button>

          </ScrollView>
        </View>
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
    height: Platform.OS === 'android' ? CARD_HEIGHT + 50 : CARD_HEIGHT,
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
});



