/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import DashboardCard from "../../../components/Kibanda/DashboardCard";
import Background from "../../../components/UI/Background";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import { COLORS } from "../../../constants/colors";
import { AppContext } from "../../../store/context";

function Orders() {
  const AppCtx = useContext(AppContext);
  if (AppCtx.kibandaOrders === undefined) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.cardHolder}>
          <DashboardCard
            gradientColors={[COLORS.secondary, "#FFA200"]}
            title="Total Orders"
            subtitle="Received"
            number={2}
          />
          <DashboardCard
            gradientColors={["#55A630", "#80B918"]}
            title="Today Received"
            subtitle="Orders"
            style={{ marginLeft: "2%" }}
            number={3}
          />
        </View>
      </View>
    </Background>
  );
}

export default memo(Orders);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "2%",
    marginTop: "5%",
    flex: 0.2, // i added this so make sure your cards occupy 20% of the screen
  },
});
