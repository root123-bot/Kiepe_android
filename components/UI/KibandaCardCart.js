/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BASE_URL } from "../../constants/domain";

function KibandaCardCart({ metadata, restaurant, handleDelete }) {
  return (
    <View>
      <View>
        <Image
          source={{
            uri: `${BASE_URL}${restaurant.get_cover_photo}`,
          }}
          style={styles.image}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{metadata.title}</Text>
          <Text style={styles.price}>Total: Tsh{metadata.subTotal}/=</Text>
        </View>
      </View>
    </View>
  );
}

export default memo(KibandaCardCart);

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "montserrat-17",
    color: "#000",
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontFamily: "montserrat-17",
    color: "#000",
    marginRight: 10,
  },
});
