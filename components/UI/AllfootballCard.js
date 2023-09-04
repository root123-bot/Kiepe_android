/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useContext, memo } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import * as ImageCache from "react-native-expo-image-cache";
import { AppContext } from "../../store/context";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { isUserExist } from "../../utils/requests";

const deviceWidth = Dimensions.get('window').width
let desiredWidth = 120;
let desiredHeight = 95

if (deviceWidth < 400 ) {
  desiredWidth = 100
  desiredHeight = 65
}

if (deviceWidth < 350) {
  desiredWidth = 80
  desiredHeight = 65
}

function AllFootballCard({
  brand,
  location,
  rating,
  opened,
  image,
  isFavorite,
  userId,
  restaurant,
  distance,
}) {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);

  const preview = {
    uri: image,
  };
  const uri = image;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        AppCtx.manipulateShowLoadingSpinner(true);
        AppCtx.manipulateShowLoadingSpinner2(false);
        AppCtx.manipulateClickedKibanda(restaurant.brand_name);
        setTimeout(() => {
          console.log("Restaurant ", restaurant.get_user_id)
          isUserExist(restaurant.phone_number).then(data => {
            console.log('THIS IS RESPONSE ', data)
            if (data.message === "User exist") {
              navigation.navigate("KibandaDetails", {
                restaurant,
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
      }}
    >
      <View style={styles.innerContainer}>
        <View
          style={{
            width: "35%",
            height: "100%",
          }}
        >
          <ImageCache.Image
            tint="light"
            transitionDuration={300}
            style={[styles.imageStyle]}
            {...{ preview, uri }}
          />
        </View>
        <View
          style={[{
            width: "65%",
            height: "100%",
            flexDirection: "row",
            marginTop: distance ? 2 : 5,
            alignItems: "flex-start",
          }, deviceWidth < 350 && { marginTop: 0 }]}
        >
          <View
            style={{
              width: "75%",
            }}
          >
            <Text numberOfLines={1} style={styles.brand}>
              {`${
                brand.length > 14 ? brand.substring(0, 14 - 3) + "..." : brand
              }`}
            </Text>
            {rating && (
              <View style={styles.ratingContainer}>
                <Rating
                  imageSize={15}
                  ratingCount={5}
                  startingValue={rating}
                  readonly
                />
              </View>
            )}
            <View>
              <Text numberOfLines={1} style={styles.address}>{location}</Text>
              {distance && (
                <Text
                  style={[
                    styles.address,
                    { marginTop: 3, color: COLORS.danger, marginBottom: 3 },
                  ]}
                >
                  Distance: {distance}
                </Text>
              )}
            </View>
          </View>
          <View>
            <View
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
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
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 5,
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
      </View>
    </TouchableOpacity>
  );
}

export default memo(AllFootballCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    borderColor: "#DEE2E6",
    borderWidth: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 15,
    height: desiredHeight,
  },
  imageStyle: {
    width: desiredWidth,
    height: desiredHeight,

  },
  brand: {
    fontFamily: "montserrat-17",
    fontSize: 15,
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
    width: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    width: 20,
    height: 20,
  },
});
