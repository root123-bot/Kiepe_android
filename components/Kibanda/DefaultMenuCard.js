/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { useState, memo, useContext, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppContext } from "../../store/context";
import MenuItem from "../UI/MenuItem";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Icon } from "@rneui/base";
import ItemPrice from "../UI/ItemPrice";
import { Button } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

function DefaultMenuCard({ style, title, gradientColors, onOffHandler }) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();

  if (AppCtx.defaultKibandaMenu.get_menu_list === undefined) {
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
    <LinearGradient style={[styles.container, style]} colors={gradientColors}>
      <View>
        <View
          style={{
            backgroundColor: "#B69121",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.title]}>{title}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditDefaultMenu", {
                defaultmenu: AppCtx.defaultKibandaMenu,
                allMeals: AppCtx.menuAddedByAdministratorForRestaurantsToChoose,
              })
            }
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                // underlineColor: COLORS.primary,
                textDecorationLine: "underline",
                color: COLORS.primary,
                marginHorizontal: 10,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            margin: 10,
          }}
        >
          {AppCtx.defaultKibandaMenu.get_menu_list &&
            AppCtx.defaultKibandaMenu.get_menu_list
              .filter((data) => data.type === "menu")
              .map((item, index) => {
                return (
                  <ItemPrice
                    key={index}
                    title={item.menuItemName}
                    price={item.menuItemPrice}
                  />
                );
              })}
        </View>
        <View
          style={{
            backgroundColor: "#B69121",
          }}
        >
          <Text
            style={[
              styles.title,
              {
                textAlign: "left",
              },
            ]}
          >
            My Ingredients
          </Text>
        </View>
        <View
          style={{
            margin: 10,
          }}
        >
          {AppCtx.defaultKibandaMenu.get_menu_list &&
            AppCtx.defaultKibandaMenu.get_menu_list
              .filter((data) => data.type !== "menu")
              .map((item, index) => {
                return (
                  <ItemPrice
                    key={index}
                    title={item.menuItemName}
                    price={item.menuItemPrice}
                    noPrice
                  />
                );
              })}
        </View>
      </View>
    </LinearGradient>
  );
}

export default memo(DefaultMenuCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
  },
  title: {
    fontFamily: "overpass-reg",
    fontSize: 20,
    color: "#fff",
    margin: 10,
    textAlign: "center",
  },
});
