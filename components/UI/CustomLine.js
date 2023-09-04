import { View, StyleSheet } from "react-native";
import React, { memo } from "react";

function CustomLine({ style }) {
  return <View style={[styles.customLine, style]}></View>;
}

export default memo(CustomLine);

const styles = StyleSheet.create({
  customLine: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cfcfcf",
  },
});
