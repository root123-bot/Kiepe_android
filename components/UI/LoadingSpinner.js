import React, { memo } from "react";
import { View, ActivityIndicator, StatusBar, StyleSheet } from "react-native";

function LoadingSpinner({ color }) {
  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ActivityIndicator color={color && color} />
      </View>
    </>
  );
}

export default memo(LoadingSpinner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
