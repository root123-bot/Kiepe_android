/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function DashboardCard({
  style,
  title,
  subtitle,
  gradientColors,
  number,
  onPress,
}) {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <LinearGradient style={[styles.container, style]} colors={gradientColors}>
        <View style={styles.innerContainer}>
          <View style={styles.tcontainer}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.sub}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.idadiWrapper}>
          <View style={styles.textContainer}>
            <Text style={styles.idadi}>{number}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
export default memo(DashboardCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 120,
    borderRadius: 15,
  },
  innerContainer: {
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tcontainer: {
    flex: 1,
    margin: 10,
    marginBottom: 0,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontFamily: "montserrat-17",
  },
  sub: {
    color: "white",
    fontSize: 20,
    fontFamily: "montserrat-17",
  },
  idadiWrapper: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textContainer: {
    marginRight: 10,
    marginBottom: 10,
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  idadi: {
    color: "#55A630",
    fontFamily: "montserrat-17",
  },
});
