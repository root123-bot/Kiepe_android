/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useContext } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import * as ImageCache from "react-native-expo-image-cache";
import { AppContext } from "../../store/context";
import { useNavigation } from "@react-navigation/native";

function KibandaCard1({
  brand,
  location,
  rating,
  opened,
  image,
  isFavorite,
  userId,
  style,
  needBorder,
}) {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);


  const preview = {
    uri: image,
  };
  const uri = image;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.innerContainer}>
        <ImageCache.Image
          tint="light"
          transitionDuration={300}
          style={[styles.imageStyle]}
          {...{ preview, uri }}
        />

        <View style={styles.footer}>
          <View>
            <Text style={styles.brand}>{brand}</Text>
            {rating && (
              <View style={styles.ratingContainer}>
                <Rating
                  imageSize={20}
                  ratingCount={5}
                  startingValue={rating}
                  readonly
                />
              </View>
            )}
            <View>
              <Text style={styles.address}>{location}</Text>
            </View>
          </View>
          <View>
            <View style={styles.iconHolder}>
              <Image
                style={styles.status}
                source={
                  opened
                    ? require("../../assets/images/open.png")
                    : require("../../assets/images/closed.png")
                }
              />
              <Image
                style={styles.status}
                source={require("../../assets/images/lunch.png")}
              />
            </View>
          </View>
        </View>
        <View style={styles.fav}>
          <TouchableOpacity
            onPress={() => {
              if (!isFavorite) {
                AppCtx.manipulateFavoriteVibanda({
                  user_id: userId,
                  status: "add",
                });
              } else {
                AppCtx.manipulateFavoriteVibanda({
                  user_id: userId,
                  status: "remove",
                });
              }
            }}
          >
            <AntDesign
              name={isFavorite ? "heart" : "hearto"}
              size={25}
              color="#D00000"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default memo(KibandaCard1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    // marginVertical: 10,
  },
  innerContainer: {
    flex: 1,
    margin: 15,
  },
  imageStyle: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontFamily: "montserrat-17",
    fontSize: 18,
    textTransform: "capitalize",
    color: "grey",
  },
  ratingContainer: {
    marginVertical: 5,
    flexDirection: "row",
    width: "100%",
  },
  address: {
    fontFamily: "montserrat-17",
    color: "grey",
    textTransform: "capitalize",
    fontSize: 11.5,
  },

  iconHolder: {
    flex: 1,
    width: 50,
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "center",
  },
  status: {
    width: 20,
    height: 20,
  },
  fav: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
