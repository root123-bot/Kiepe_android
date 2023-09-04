/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants/colors";
import ToggleSwitch from "toggle-switch-react-native";
import CustomLine from "./CustomLine";

function MenuItem({
  image,
  title,
  toggledHandler,
  isDefaultItem,
  id,
  textStyle,
  removeline,
  shouldBeOn,
  type,
  availableMenuCard,
  shouldSendDefaultMenuPrice,
  defaultmenu,
}) {
  const [isOn, setIsOn] = useState(shouldBeOn);
  function handleOnToggle(status) {
    setIsOn(status);
    toggledHandler({
      menu: {
        id: +id,
        name: title,
        type: type,
        price:
          shouldSendDefaultMenuPrice &&
          defaultmenu.get_menu_list.find((item) => +item.parent_menu === +id)
            ? defaultmenu.get_menu_list.find(
                (item) => +item.parent_menu === +id
              ).menuItemPrice
            : null,
      },
      status,
    });
  }
  return (
    <View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginBottom: 10,
          },
        ]}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              {
                fontFamily: "montserrat-17",
                fontSize: 16,
                color: COLORS.primary,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>

        <ToggleSwitch
          isOn={isDefaultItem ? true : isOn}
          onColor={availableMenuCard ? "#80B918" : COLORS.secondary}
          offColor="grey"
          disabled={isDefaultItem ? true : false}
          onToggle={handleOnToggle}
        />
      </View>
      {!removeline && <CustomLine />}
    </View>
  );
}

export default memo(MenuItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
});
