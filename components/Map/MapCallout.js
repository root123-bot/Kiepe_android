/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BASE_URL } from "../../constants/domain";
import * as ImageCache from "react-native-expo-image-cache";
import { Button } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Svg, Image as ImageSvg } from "react-native-svg";
import { AppContext } from "../../store/context";
import LoadingSpinner from "../UI/LoadingSpinner";

function MapCallout({ kibanda }) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  const preview = {
    uri: `${BASE_URL}${kibanda.get_cover_photo}`,
  };
  const uri = `${BASE_URL}${kibanda.get_cover_photo}`;

  return (
    <TouchableOpacity
      style={{
        width: 170,
        height: 150,
        backgroundColor: "white"
      }}
      // onPress={() => {
      //   AppCtx.manipulateShowLoadingSpinner(true);
      //   AppCtx.manipulateShowLoadingSpinner2(false);

      //   setTimeout(() => {
      //     navigation.navigate("KibandaDetails", {
      //       restaurant: kibanda,
      //     });
      //   });
      // }}
    >
      {/* buy this guy coffee the one recommend us to use thsi ImageSvg i think its better as i see it cache images also https://github.com/react-native-maps/react-native-maps/issues/2633 */}
      <Svg width={170} height={120}>
        <ImageSvg
          width={"100%"}
          height={"100%"}
          preserveAspectRatio="xMidYMid slice"
          href={{ uri: `${BASE_URL}${kibanda.get_cover_photo}` }}
        />
      </Svg>

      <Text
        onPress={() => "hello world"}
        style={{
          textAlign: "center",
          marginTop: 5,
          fontFamily: "montserrat-17",
          color: "grey",
        }}
      >{`${kibanda.brand_name.toUpperCase()}`}</Text>
    </TouchableOpacity>
  );
}

export default memo(MapCallout);
