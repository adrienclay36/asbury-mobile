import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import ChangePasswordHeader from "./ChangePasswordHeader";
import Feather from "react-native-vector-icons/Feather";
import Card from "../../components/ui/Card";
import * as Animatable from "react-native-animatable";
import { Colors, Portal, Modal } from "react-native-paper";
const { height, width } = Dimensions.get("window");
import { UserContext } from "../../store/UserProvider";
import { supabase } from "../../supabase-service";
import { ASBURY_KEY_TWO } from "@env";
import UIModal from "../../components/ui/UIModal";
import * as SecureStore from "expo-secure-store";
const ITEM_SIZE = height - 50;
const ChangePasswordScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
    passwordIsValid: true,
    confirmPasswordIsValid: true,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
  });

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

  const handlePasswordChange = (text) => {
    if (text.trim().length > 6 && !text.includes(" ")) {
      setData({
        ...data,
        password: text,
        passwordIsValid: true,
      });
    } else {
      setData({
        ...data,
        password: text,
        passwordIsValid: false,
      });
    }
  };

  const handleConfirmPasswordChange = (text) => {
    if (text === data.password) {
      setData({
        ...data,
        confirmPassword: text,
        confirmPasswordIsValid: true,
      });
    } else {
      setData({
        ...data,
        confirmPassword: text,
        confirmPasswordIsValid: false,
      });
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    if (
      data.confirmPassword &&
      data.password &&
      data.confirmPasswordIsValid &&
      data.passwordIsValid
    ) {
      const { data: passData, error: passError } = await supabase.auth.update({
        password: data.password,
      });

      if (!passError) {
        setSuccess(true);
        await SecureStore.setItemAsync(ASBURY_KEY_TWO, data.password);
        setData({
          ...data,
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setError(false);
          navigation.goBack();
        }, 2000);
      } else {
        setErrorMessage(passError.message);
        setError(true);
      }
    }
    setLoading(false);
  };
  return (
    <View>
      {/* Success Modal */}
      <UIModal
        type="success"
        text="Successfully Changed Password."
        showModal={success}
        dismissModal={null}
      />
      {/* Error Modal */}
      <UIModal
        type="error"
        text={"The following error occurred:"}
        errorMessage={errorMessage}
        showModal={error}
        dismissModal={() => setError(false)}
      />

      <ChangePasswordHeader
        loading={loading}
        navigation={navigation}
        saveChanges={saveChanges}
      />

      <Animatable.View animation="fadeInUpBig">
        <Card height={ITEM_SIZE}>
          <Text style={[styles.text_footer, { marginTop: 25 }]}>
            New Password
          </Text>
          <View
            style={[
              styles.action,
              userContext.loading && styles.changingPassword,
            ]}
          >
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              editable={!loading}
              style={styles.textInput}
              secureTextEntry={data.secureTextEntry}
              value={data.password}
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
          {!data.passwordIsValid && (
            <Animatable.View animation="bounceIn">
              <Text style={styles.errorText}>
                Your password must be more than six characters
              </Text>
            </Animatable.View>
          )}
          <Text style={[styles.text_footer, { marginTop: 25 }]}>
            Confirm New Password
          </Text>
          <View
            style={[
              styles.action,
              userContext.loading && styles.changingPassword,
            ]}
          >
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              editable={!loading}
              style={styles.textInput}
              value={data.confirmPassword}
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
          {!data.confirmPasswordIsValid && (
            <Animatable.View animation="bounceIn">
              <Text style={styles.errorText}>Passwords Must Match</Text>
            </Animatable.View>
          )}
        </Card>
      </Animatable.View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  action: {
    flexDirection: "row",

    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,

    paddingLeft: 10,
    color: "#05375a",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    marginBottom: 15,
  },
  errorText: {
    color: Colors.red600,
  },
  changingPassword: {
    opacity: 0.3,
  },
  successModal: {
    backgroundColor: Colors.white,
    height: height * 0.2,
    marginHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  modalText: {
    textAlign: "center",
    fontWeight: "500",
  },
  modalIcon: {
    marginBottom: 15,
  },
});
