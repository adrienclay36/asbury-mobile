import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { supabase } from '../supabase-service'
import { getItemById, getPublicUrl } from '../supabase-util'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeTabNavigator from './HomeTabNavigator'
const Drawer = createDrawerNavigator();
import ProfileStack from './ProfileStack';
import DrawerContent from '../components/DrawerContent/DrawerContent';
import * as Notifications from 'expo-notifications';
const MainDrawerNavigator = ({ navigation, route }) => {


  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
  }, []);

  const handleNotificationResponse = async (response) => {
    const type = response.notification.request.content.data.type;
    if (type === "POST_LIKED" || type === 'NEW_COMMENT') {
      const postID = response.notification.request.content.data.postID;
      navigation.navigate('JoysStack');
      
      const post = await getItemById("prayers", postID);
      const postData = post[0];
      const { data, error } = await supabase
        .from("users")
        .select()
        .match({ id: postData.user_id });
      const user = data[0];

      const fetchedAvatar = await getPublicUrl("avatars", user.avatar_url);

      navigation.navigate("PostDetails", {
        formatName: `${user.first_name} ${user.last_name}`,
        liveLikes: postData.likes,
        id: postData.id,
        postContent: postData.postcontent,
        formatDate: new Date(postData.postdate).toLocaleDateString('en-US'),
        postType: postData.posttype,
        userID: postData.user_id,
        avatarURL: fetchedAvatar,
      });
    }
  };


  return (
    <Drawer.Navigator
      
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeTabNavigator} />
      <Drawer.Screen name="ProfileStack" component={ProfileStack} />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator

const styles = StyleSheet.create({})