import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper';
import { userColors } from '../../constants/userColors';
const CustomTextInput = ({ value, setValue, label, placeholder, style, multiline, numberOfLines, mode, keyboardType, returnKeyType, returnKeyLabel}) => {
  return (
   
      <TextInput
      multiline={multiline || false}
      numberOfLines={numberOfLines}
        keyboardAppearance='dark'
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        returnKeyLabel={returnKeyLabel}

        style={{...style}}
        theme={{ colors: { primary: userColors.seaFoam600 } }}
        label={label}
        selectionColor={userColors.seaFoam600}
        value={value}
        onChangeText={(text) => setValue(text)}
        mode={mode || 'outlined'}
        underlineColor={userColors.seaFoam600}
    
        placeholder={placeholder}
      />
   
  );
}

export default CustomTextInput

const styles = StyleSheet.create({})