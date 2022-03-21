import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window');
const IconButton = ({ onPress, text, icon, color, style }) => {
  return (
    <TouchableOpacity
     onPress={onPress}
      style={[styles.button, {...style}]}
    >
      <MaterialCommunityIcons
        name={icon}
        color={color}
        size={30}
        style={{ marginBottom: 10 }}
      />
      <View>
        <Text style={{ textAlign: "center", fontWeight: "500" }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default IconButton

const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width  * .5,
        
    }
})