import { StyleSheet, Text, View } from 'react-native'
import { Colors } from 'react-native-paper';
import React from 'react'
import Card from './Card';
const SkeletonPost = ({ ITEM_SIZE }) => {
  return (
    <Card height={ITEM_SIZE}>
      <View
        style={styles.avatar}
      />
      <View style={styles.textLine} />
      <View style={styles.textLine} />
      <View style={styles.textLine} />
      <View style={styles.textLine} />

    </Card>
  );
}

export default SkeletonPost

const styles = StyleSheet.create({
  avatar: {
          height: 50,
          width: 50,
          marginBottom: 10,
          borderRadius: 25,
          backgroundColor: Colors.grey100,
          justifyContent: "flex-start",
          alignItems: "center",
        },
  textLine: {
          height: 10,
          backgroundColor: Colors.grey100,
          borderRadius: 5,
          marginBottom: 4,
        }
  
})