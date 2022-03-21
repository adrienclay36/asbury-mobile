import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfilePage from '../../components/Profile/ProfilePage'
const ProfileScreen = ({ navigation }) => {
  return (
    <>
      <ProfilePage navigation={navigation}/>
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})