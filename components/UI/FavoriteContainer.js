/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "../../store/context";
import * as ImageCache from "react-native-expo-image-cache";
import { BASE_URL } from "../../constants/domain";
import { useNavigation } from "@react-navigation/native";
import { MapCallout } from "react-native-maps";
import FavoriteKibanda from "./FavoriteKibanda";

function FavoriteContainer() {
  const navigation = useNavigation();

  const AppCtx = useContext(AppContext);
  const favoriteVibanda = AppCtx.availableVibanda.filter((kibanda) =>
    AppCtx.favoriteVibanda.includes(kibanda.data.get_user_id)
  );

  /* { height, width } ya FavoriteKibanda ni 140 * 140, ko its okay to have the
     height of 160 > or 170 > here, but not less than 140 also you should notice
     that we have the title below so its okay to have width of 160 >
  */
  return (
    <View
      style={{
        height: 160,
      }}
    >
      <View
        style={{
          height: "100%",
        }}
      >
        <ScrollView
          style={{
            marginTop: "2%",
            // height: 220,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {favoriteVibanda.map((kibanda, index) => (
            <FavoriteKibanda key={index} kibanda={kibanda.data} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default memo(FavoriteContainer);
