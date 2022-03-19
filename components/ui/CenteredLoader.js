import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { userColors } from '../../constants/userColors'
const CenteredLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={userColors.seaFoam600} size={'large'}/>
    </View>
  )
}

export default CenteredLoader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})