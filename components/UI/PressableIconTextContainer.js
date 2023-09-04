import { View, StyleSheet, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { memo } from "react";

function PressableIconTextContainer({
  color,
  size,
  name,
  onPress,
  style,
  children,
  titleStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [pressed && styles.buttonPressed]}
    >
      <View style={[styles.outerContainer, style]}>
        <AntDesign name={name} size={size} color={color} />
        <Text style={[styles.textStyle, titleStyle]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default memo(PressableIconTextContainer);

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 15,
  },
  textStyle: {
    fontSize: 18,
    fontFamily: "overpass-reg",
  },
  buttonPressed: {
    opacity: 0.5,
  },
});
