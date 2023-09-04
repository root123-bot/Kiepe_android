/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AvailableMenuCard from "../../../components/Kibanda/AvailableMenuCard";
import DefaultMenuCard from "../../../components/Kibanda/DefaultMenuCard";
import Background from "../../../components/UI/Background";
import { COLORS } from "../../../constants/colors";
import { AppContext } from "../../../store/context";
import { manipulateTodayAvailableMenuItem } from "../../../utils/requests";

function Menus() {
  const AppCtx = useContext(AppContext);

  async function executeToggleOnOffAvailableMenu(metadata) {
    try {
      const result = await manipulateTodayAvailableMenuItem(
        AppCtx.usermetadata.id,
        metadata.menu.id,
        metadata.status ? "add" : "remove"
      );
    } catch (error) {
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View
          style={{
            marginTop: 30,
          }}
        >
          <DefaultMenuCard
            title="My Default Menu"
            gradientColors={[COLORS.secondary, "#FFA200"]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(Menus);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
