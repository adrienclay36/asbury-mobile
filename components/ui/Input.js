import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useReducer, useEffect, useState } from "react";
import { primaryFont } from "../../constants/fonts";
import { Colors } from "react-native-paper";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
        touched: true,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });
  

  const { onInputChange, id } = props;

  useEffect(() => {
    onInputChange(id, inputState.value, inputState.isValid);
  }, [inputState]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid,
      touched: true,
    });
  };


  // const lostFocusHandler = () => {
  //   dispatch({ type: INPUT_BLUR });
  // };
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  form: {
    margin: 20,
  },
  label: {
    fontFamily: primaryFont.bold,
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.grey300,
    borderRadius: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: primaryFont.light,
    color: "red",
    fontSize: 13,
  },
});
