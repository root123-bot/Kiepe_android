/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet } from "react-native";

function Background({ children, image, style }) {
  return (
    <>
      <StatusBar style={"dark"} />
      <LinearGradient
        colors={["#000000", "#000000"]}
        style={[{ flex: 1 }, style && style]}
      >
        <ImageBackground
          style={[styles.imgBack]}
          imageStyle={{ opacity: 0.5 }}
          source={
            image ? image : require("../../assets/images/background/2.jpg")
          }
        >
          {children}
        </ImageBackground>
      </LinearGradient>
    </>
  );
}
export default memo(Background);

const styles = StyleSheet.create({
  imgBack: {
    flex: 1,
  },
});
