/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { memo, useState, useContext, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { Button, HelperText } from "react-native-paper";
import CustomLine from "../UI/CustomLine";
import ToggleSwitch from "toggle-switch-react-native";
import { AppContext } from "../../store/context";
import MenuItem from "../UI/MenuItem";
import LoadingSpinner from "../UI/LoadingSpinner";

/* 
  hapa cha muhimu ni kwamba any time user tries to toggle the switch on you should
  check if he set the default "meal" for that day, you can do that by going to deaultMeal
  model and get all default meal belong to kibanda and detect the one that has the same
  day as today, if it doesn't exist then you should show a message to user that he/she
  should set the default meal for today, you can allow the  user to use the default one if 
  he want as its meal or to set the customized one...
*/

/* hizi props zikichange also this component re-render so here in case of our function ni lazima in Dashboard.js
 tuzi-wrap in useCallback, mwanzo nilikuwa najua inabidi tutumie useCallback if that function is used as dependency
 in the useEffect but ile useEffect() imewekwa ili kutuonesha ni jinsi gani hizi component zinakuwa-re-rendered if the
 function in parent re-created but in actual sense is that if any props change the nested component re-created that all
 so you should know that so it worth to say in most case in our project whenever we pass the function to the nested 
 we should wrap that function callback..
 */
function AvailableMenuCard({
  style,
  title,
  gradientColors,
  rStatusImg,
  onChangeHandler,
  menuitems,
  onOffHandler,
  defaultMenu,
  manipulateShowSetTodayMenuDialogueHandler,
}) {
  const AppCtx = useContext(AppContext);
  const [isOn, setIsOn] = useState(AppCtx.usermetadata.is_kibanda_opened);

  useEffect(() => {}, [AppCtx.isLoadingAvailableMenu]);

  function toggledHandler(metadata) {
    // setIsOn(!isOn);
    onOffHandler(metadata);
  }
  return (
    <LinearGradient style={[styles.container, style]} colors={gradientColors}>
      <View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={[styles.title]}>{title}</Text>
        </View>
        <View>
          <HelperText
            padding="none"
            style={{
              color: COLORS.primary,
              fontFamily: "overpass-reg",
            }}
            type="info"
          >
            ** This will be displayed to the user when placing orders
          </HelperText>
        </View>
        <CustomLine />

        {AppCtx.isLoadingAvailableMenu || AppCtx.isUpdatingAvailableMenu ? (
          <View
            style={{
              marginVertical: 30,
            }}
          >
            <LoadingSpinner color={COLORS.primary} />
          </View>
        ) : AppCtx.defaultKibandaMenu.get_menu_list && menuitems.get_menu ? (
          AppCtx.defaultKibandaMenu.get_menu_list.map((item, index) => {
            return (
              <MenuItem
                key={index}
                id={item.menuItemId}
                title={item.menuItemName}
                // price={item.price}
                removeline
                availableMenuCard
                shouldBeOn={menuitems.get_menu
                  .map((value) => value.id)
                  .includes(item.menuItemId)}
                toggledHandler={toggledHandler}
              />
            );
          })
        ) : (
          <>
            <Text
              style={{
                fontFamily: "overpass-reg",
                fontSize: 12.5,
                color: COLORS.primary,
              }}
            >
              You haven't yet set today menu.
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  fontSize: 12.3,
                  color: COLORS.primary,
                }}
              >
                To add today available menu you should first open the
                restaurant.
              </Text>
              {/* <TouchableOpacity
                onPress={() => {
                  manipulateShowSetTodayMenuDialogueHandler();
                }}
              >
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
              </TouchableOpacity> */}
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

export default memo(AvailableMenuCard);

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
