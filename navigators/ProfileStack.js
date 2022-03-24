import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator();
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ProfileScreenHeader from '../screens/Profile/ProfileScreenHeader';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
const ProfileStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          options={({ route }) => ({
            header: (props) => (
              <ProfileScreenHeader {...props} props={props} route={route} />
            ),
          })}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{ headerShown: false}}
          name="EditProfileScreen"
          component={EditProfileScreen}
        />
        <Stack.Screen options={{headerShown: false }} name="ChangePasswordScreen" component={ChangePasswordScreen}/>
      </Stack.Navigator>
    </View>
  );
}

export default ProfileStack

const styles = StyleSheet.create({})