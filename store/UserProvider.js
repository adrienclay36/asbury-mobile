import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPublicUrl, getUserPostCount } from "../supabase-util";

const TOKEN_KEY = "asbury_auth";
export const UserContext = createContext({
  userValue: null,
  userInfo: null,
  checkUser: () => {},
  signInHandler: (email, password, navigation) => {},
  authenticating: false,
  auth: null,
  avatarURL: '',
  refreshSession: (refreshToken, navigation) => {},
  signOutHandler: () => {},
  userPostCount: 0,
  formatName: '',
});
const UserProvider = (props) => {
  const [userValue, setUserValue] = useState();
  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [avatarURL, setAvatarURL] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [userPostCount, setUserPostCount] = useState(0);
  const [formatName, setFormatName] = useState('');

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

      const publicAvatarURL = await getPublicUrl('avatars', userData.avatar_url);
      setAvatarURL(publicAvatarURL);
      setPermissions(userData.permissions);
      setRole(userData.role);

      const postCount = await getUserPostCount(user.id);
      setUserPostCount(postCount);
      
    }
  };

  const checkUser = async () => {
    const user = supabase.auth.user();
    if (user) {
      setUserValue(user);

      getPermissions(user);
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


  const signOutHandler = async () => {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    setAuth(supabase.auth.session());

    supabase.auth.onAuthStateChange((event, session) => {

      if(event === 'SIGNED_OUT') {
        AsyncStorage.removeItem(TOKEN_KEY);
      }

      if(event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {

        AsyncStorage.setItem(TOKEN_KEY, session.refresh_token)
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
  };
  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
