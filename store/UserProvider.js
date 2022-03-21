import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPublicUrl, getUserPostCount } from "../supabase-util";
import * as Notifications from "expo-notifications";
import axios from "axios";
const TOKEN_KEY = "asbury_auth";

import { SERVER_URL } from '../constants/serverURL';
// const SERVER_URL = "http://localhost:3000/api";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const UserContext = createContext({
  userValue: null,
  userInfo: null,
  checkUser: () => {},
  signInHandler: (email, password, navigation) => {},
  authenticating: false,
  auth: null,
  avatarURL: "",
  refreshSession: (refreshToken, navigation) => {},
  signOutHandler: () => {},
  userPostCount: 0,
  formatName: "",
  sendPushNotification: (userID, title, body, postID) => {},
  transactions: [],
  totalDonations: 0,
  refreshTransactions: () => {},
  refreshing: false,
  subscribed: false,
  customerID: "",
  gettingUser: false,

});
const UserProvider = (props) => {
  const [userValue, setUserValue] = useState();
  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [avatarURL, setAvatarURL] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [userPostCount, setUserPostCount] = useState(0);
  const [formatName, setFormatName] = useState("");
  const [pushToken, setPushToken] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [customerID, setCustomerID] = useState("");
  const [totalDonations, setTotalDonations] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [gettingUser, setGettingUser] = useState(false);
  

  const getPermissions = async (user) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .match({ id: user.id });

    if (data) {
      const userData = data[0];
      setUserInfo(userData);

      const name = `${userData.first_name} ${userData.last_name}`;
      setFormatName(name);

      const publicAvatarURL = await getPublicUrl(
        "avatars",
        userData.avatar_url
      );
      setAvatarURL(publicAvatarURL);
      setPermissions(userData.permissions);
      setRole(userData.role);

      const postCount = await getUserPostCount(user.id);
      setUserPostCount(postCount);
      getPushPermissions(user.id);

      if (!userData.customer_id) {
        await establishCustomer(userData);
      } else {
        setCustomerID(userData.customer_id);
        const response = await axios.get(
          `${SERVER_URL}/get-customer-invoices?customerID=${userData.customer_id}`
        );
        setTransactions(response.data.payments);
        let totalDonated = 0;
        for (let payment of response.data.payments) {
          let amount = payment.charges.data[0].amount;
          if (typeof amount === "number") {
            totalDonated += parseInt(amount) / 100;
          }
        }
        setTotalDonations(totalDonated);

        await getSubscriptionStatus(userData.customer_id);
      }
    }
    setGettingUser(false);
  };

  

  const getSubscriptionStatus = async (customerID) => {
    const response = await axios.post(`${SERVER_URL}/get-user-subscriptions`, {
      customerID,
    });

    setSubscribed(response.data.subscribed);
  };

  const checkUser = async () => {
    setGettingUser(true);
    const user = supabase.auth.user();
    if (user) {
      setUserValue(user);

      await getPermissions(user);
    }
  };

  const signInHandler = async (email, password, navigation) => {
    setAuthenticating(true);
    const { data, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      console.log(error);
      setAuthenticating(false);

      return { status: "error", message: error.message };
    }
    await checkUser();
    setAuthenticating(false);
    return { status: "ok", message: auth };
  };

  const sendPushNotification = async (userID, title, body, postID, type) => {
    if (userValue.id !== userID) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .match({ id: userID });
      const token = data[0]?.push_token;

      if (token) {
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          { title, body, to: token, data: { postID, type: type } },
          {
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip deflate",
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        return;
      }
    }
  };

  const signOutHandler = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    setAuth(supabase.auth.session());

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        AsyncStorage.removeItem(TOKEN_KEY);
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        AsyncStorage.setItem(TOKEN_KEY, session.refresh_token);
      }

      setAuth(session);
    });

    checkUser();
  }, []);

  const refreshSession = async (token, navigation) => {
    setAuthenticating(true);
    const { data, error } = await supabase.auth.signIn({ refreshToken: token });
    if (error) {
      console.log(error);
      setAuthenticating(false);

      return { status: "error", message: error.message };
    }
    await checkUser();
    setAuthenticating(false);
    return { status: "ok", message: auth };
  };

  const getPushPermissions = async (userID) => {
    let retrievedToken;
    const permissionStatus = await Notifications.getPermissionsAsync();

    if (permissionStatus.canAskAgain && !permissionStatus.granted) {
      const request = await Notifications.requestPermissionsAsync();
      if (request.granted) {
        const token = await Notifications.getExpoPushTokenAsync();
        retrievedToken = token.data;
        setPushToken(retrievedToken);
        updatePushToken(retrievedToken, userID);
      }
    } else if (permissionStatus.granted) {
      const token = await Notifications.getExpoPushTokenAsync();
      updatePushToken(token.data, userID);
    } else if (!permissionStatus.canAskAgain && !permissionStatus.granted) {
      return;
    }
  };

  const updatePushToken = async (token, userID) => {
    const { data, error } = await supabase
      .from("users")
      .update({ push_token: token })
      .match({ id: userID });
  };

  const establishCustomer = async (userInfo) => {
    const name = `${userInfo.first_name} ${userInfo.last_name}`;
    const customerObject = {
      name: name,
      email: userInfo.email,
      userID: userInfo.id,
    };
    const response = await axios.post(
      `${SERVER_URL}/establish-new-customer`,
      customerObject
    );
    setCustomerID(response.data.customerID);
  };

  const refreshTransactions = async () => {
    setRefreshing(true);
    const response = await axios.get(
      `${SERVER_URL}/get-customer-invoices?customerID=${customerID}`
    );
    setTransactions(response.data.payments);
    let totalDonated = 0;
    for (let payment of response.data.payments) {
      let amount = payment.charges.data[0].amount;
      if (typeof amount === "number") {
        totalDonated += parseInt(amount) / 100;
      }
    }
   
    setTotalDonations(totalDonated);
    setRefreshing(false);
    
  };

  const contextValue = {
    userValue,
    userInfo,
    checkUser,
    authenticating,
    auth,
    signInHandler,
    avatarURL,
    refreshSession,
    signOutHandler,
    userPostCount,
    formatName,
    updatePushToken,
    sendPushNotification,
    transactions,
    totalDonations,
    refreshTransactions,
    refreshing,
    subscribed,
    customerID,
    gettingUser,
  };
  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
