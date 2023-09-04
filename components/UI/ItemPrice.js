/* eslint-disable react-native/no-inline-styles */
import React, { useState, memo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants/colors";
import CustomLine from "./CustomLine";

function ItemPrice({ title, price, noPrice }) {
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
            ]}
          >
            {title}
          </Text>
        </View>
        {!noPrice ? (
          <Text
            style={{
              fontFamily: "montserrat-17",
              fontSize: 16,
              color: COLORS.primary,
              width: "32%",
              textAlign: "left",
            }}
          >
            Tsh {`${price}`}/=
          </Text>
        ) : (
          <></>
        )}
      </View>
      <CustomLine />
    </View>
  );
}

export default memo(ItemPrice);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
});
