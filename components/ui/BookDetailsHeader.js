import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { userColors } from '../../constants/userColors'
import { Appbar, Colors } from 'react-native-paper'
import { primaryFont } from '../../constants/fonts'

const BookDetailsHeader = ({ navigation, route, back, props, title }) => {
  return (
    <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content titleStyle={{fontFamily: primaryFont.medium, letterSpacing: 1.5, color: Colors.white}} title={route.params?.author} />
    </Appbar.Header>
  )
}

export default BookDetailsHeader

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40,
    height: 100,
    backgroundColor: userColors.seaFoam500,
  },
  header: {
    backgroundColor: userColors.seaFoam600,
  },
});