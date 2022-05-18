import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
const RegularAnimation = ({
  source = null,
  height,
  width,
  loop = false,
  speed = 1,
}) => {
  const animationRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef?.current?.play();
    }, 25);

    return () => {
      animationRef?.curent?.reset();
      clearTimeout(timeout);
    };
  }, []);
  return (
    <LottieView
      ref={animationRef}
      source={source}
      style={{ height: height, width, width }}
      loop={loop}
      speed={speed}
    />
  );
};

export default RegularAnimation;

const styles = StyleSheet.create({});
