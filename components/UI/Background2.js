/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View } from "react-native";
import LoadingSpinner from "./LoadingSpinner";

function Background2({ children, style, statusStyle, imageToUpdate, loading }) {
  return (
    <>
      <StatusBar style={statusStyle ? statusStyle : "dark"} />
      <LinearGradient
        colors={["#000000", "#000000"]}
        style={[{ flex: 1 }, style && style]}
      >
        {loading ? (
          <View style={{ flex: 1, height: 240, backgroundColor: "grey" }}>
            <LoadingSpinner />
          </View>
        ) : (
          <ImageBackground
            style={[styles.imgBack]}
            imageStyle={{ opacity: 0.5 }}
            source={
              imageToUpdate
                ? imageToUpdate
                : require("../../assets/images/background/2.jpg")
            }
          >
            {children}
          </ImageBackground>
        )}
      </LinearGradient>
    </>
  );
}
export default memo(Background2);

const styles = StyleSheet.create({
  imgBack: {
    flex: 1,
  },
});
