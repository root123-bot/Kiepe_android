/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BASE_URL } from "../../constants/domain";
import * as ImageCache from "react-native-expo-image-cache";
import { Button } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../store/context";
import { isUserExist } from "../../utils/requests";

function FavoriteKibanda({ kibanda }) {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);
  const preview = {
    uri: `${BASE_URL}${kibanda.get_cover_photo}`,
  };
  const uri = `${BASE_URL}${kibanda.get_cover_photo}`;
  return (
    <TouchableOpacity
      onPress={() => {
        AppCtx.manipulateShowLoadingSpinner(true)
        AppCtx.manipulateShowLoadingSpinner2(false)
        AppCtx.manipulateClickedKibanda(kibanda.brand_name);

        setTimeout(() => {
          // HAPAHAPA TU-CHECK IF KIBANDA EXIST OR NOT.. b4 we navigate..
          isUserExist(kibanda.phone_number).then(data => {
            console.log('THIS IS RESPONSE ', data)
            if (data.message === "User exist") {
              navigation.navigate("KibandaDetails", {
                restaurant: kibanda
              });
            }
            else {
              AppCtx.manipulateShowLoadingSpinner(false);
              AppCtx.manipulateShowLoadingSpinner2(true);
              alert("Sorry, restaurant has been deleted!")
            }
            
          }).catch(err => {
            console.log("something went wrong")
            AppCtx.manipulateShowLoadingSpinner(false);
            AppCtx.manipulateShowLoadingSpinner2(true);
            alert(err.message)
          })
          
        }, 5);
      }
      }
      style={{
        width: 140,
        height: 140,
        marginRight: 15,
      }}
    >
      <ImageCache.Image
        tint="light"
        transitionDuration={300}
        style={{
          width: "100%",
          height: 130,
          borderRadius: 15,
        }}
        {...{ preview, uri }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "montserrat-17",
          color: "grey",
          fontSize: 13,
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {kibanda.brand_name}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(FavoriteKibanda);
