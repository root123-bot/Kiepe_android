/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { memo, useState, useContext, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { HelperText } from "react-native-paper";
import CustomLine from "../UI/CustomLine";
import ToggleSwitch from "toggle-switch-react-native";
import { AppContext } from "../../store/context";
import { checkIfTodayAvailableMenuSet } from "../../utils/requests";
import { useNavigation } from "@react-navigation/native";
import LoadingSpinner from "../UI/LoadingSpinner";

/* 
  hapa cha muhimu ni kwamba any time user tries to toggle the switch on you should
  check if he set the default "meal" for that day, you can do that by going to deaultMeal
  model and get all default meal belong to kibanda and detect the one that has the same
  day as today, if it doesn't exist then you should show a message to user that he/she
  should set the default meal for today, you can allow the  user to use the default one if 
  he want as its meal or to set the customized one...
*/

/*
  if day change, if he does not have the menu for that day you should make status to be closed..
*/

/* if passed props from parent cause children component to be refreshed when its the function re-created? the answer is yes
  A React component re-renders when its state or props change. If your React component depends on other data outside of the 
  component, you may need to force a re-render.
  Kumbe sio lazima iwe ni dependency kwenye useEffect ya nested/child component but if its passed as props
  it cause also the nested component to re-render
  SO HERE WHEN THESE PROPS CHANGE THE HERE THE CHILD/NESTED COMPONENT RE-RENDER, NO NEED TO RE-RENDER 
  https://sentry.io/answers/can-you-force-a-react-component-to-re-render-without-calling-setstate/
*/
function BigCard({
  style,
  title,
  gradientColors,
  rStatusImg,
  onChangeHandler,
  forceOff,
  forceOn,
}) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  // I also have isDefaultMenuSetOnOpen turned true if the user click/set the today menu and pick
  // one of option setDeafult or setMenu... and thsi two condition should work in "OR" loop coz what
  // if i quited a app but i already set the today menu, so this should be work in "OR" and not "AND"
  // but we should find a way to update or force it to go false if user open popup but he not set the
  // today menu..? How we can achieve that??? Ok we can use "forceOff" flag
  const [isOn, setIsOn] = useState(AppCtx.initialKibandaStatus);

  return (
    <LinearGradient style={[styles.container, style]} colors={gradientColors}>
 
      <View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Image
            source={rStatusImg}
            style={{
              width: 23,
              height: 23,
              marginLeft: "3%",
            }}
          />
        </View>
        {
          AppCtx.isLoadingAvailableMenu || AppCtx.isUpdatingAvailableMenu ? (
            <View
              style={{
                marginVertical: 20,
              }}
            >
              <LoadingSpinner color={COLORS.primary} />
            </View>
          ) : (
        <View>
          <HelperText
            padding="none"
            style={[
              {
                color: COLORS.primary,
                fontFamily: "montserrat-17",
              },
              {
                fontFamily: "overpass-reg",
              },
            ]}
            type="info"
          >
            ** This will be displayed to the user when placing orders
          </HelperText>
          <View
            style={{
              marginHorizontal: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text
                style={{
                  color: "#7209B7",
                  fontFamily: "montserrat-14",
                }}
              >
                Update Status here
              </Text>
              <View
                style={{
                  marginLeft: 20,
                }}
              >
                {/* isDefaultMenuSetOpen by default is "False" */}
                <ToggleSwitch
                  isOn={forceOff ? false : forceOn ? true : isOn}
                  onColor="#80B918"
                  offColor="#D64933"
                  onToggle={(status) => {
                    setIsOn(status);
                    onChangeHandler(status);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
          )
        }
        <CustomLine />
        {/* <View>
          <Text style={styles.title}>Account Status</Text>
          <HelperText
            padding="none"
            style={{
              color: COLORS.primary,
              fontFamily: "overpass-reg",
              paddingBottom: 0,
              marginBottom: 0,
            }}
            type="info"
          >
            {`Your account is active till ${AppCtx.usermetadata.get_payments.expire_date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}`}
          </HelperText>
          <View
            style={{
              paddingTop: 0,
              marginTop: 0,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <HelperText
              padding="none"
              style={{
                color: COLORS.primary,
                fontFamily: "overpass-reg",
              }}
              type="info"
            >
              Do you want to buy a new bundle?
            </HelperText>
            <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
              <HelperText
                padding="none"
                style={{
                  marginLeft: "5%",
                  fontFamily: "montserrat-17",
                  color: "#7209B7",
                }}
              >
                Click here
              </HelperText>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    </LinearGradient>
  );
}

export default memo(BigCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
    padding: 15,
  },
  title: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "#fff",
  },
});
