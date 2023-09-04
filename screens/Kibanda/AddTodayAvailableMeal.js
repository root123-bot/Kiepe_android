/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import MenuItem from "../../components/UI/MenuItem";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import { COLORS } from "../../constants/colors";
import { Button, HelperText } from "react-native-paper";
import { addAvailableMealToday, updateKibandaStatus } from "../../utils/requests";

function AddTodayAvailableMeal({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { defaultmenu } = route.params;
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [menuToManipulate, setMenuToManipulate] = useState([{}]);
  const [selectedMenuItems, setSelectedMenuItems] = useState([
    {
      name: "Chipsi",
      id: +AppCtx.menuAddedByAdministratorForRestaurantsToChoose.find(
        (value) => value.singular_name === "Chipsi"
      ).id,
      type: "menu",
      price: null,
    },
  ]);

  useEffect(() => {
    const availablemenu = AppCtx.menuAddedByAdministratorForRestaurantsToChoose;
    const filteredAvailableMenu = availablemenu.filter((item) => {
      const defaultMenuIds = defaultmenu.map((data) => data.parent_menu);
      return defaultMenuIds.includes(item.id);
    });
    setMenuToManipulate(filteredAvailableMenu);
  }, [defaultmenu, AppCtx.menuAddedByAdministratorForRestaurantsToChoose]);


  // hii last time tume-check tukaona hai-update is_kibanda_open ina-remain "false" when we navigate to another screens
  // HAPA NIMEONA KWELI SI-UPDATE IN SERVER "upadteKibandaStatus"
  const addAvailableMealTodayHandler = async () => {
    setFormSubmitLoader(true);
    setShowAnimation(true);
    // setShowSetTodayMenuDialogue(0); has been set in dashboard before navigating here
    AppCtx.manipulateIsLoadingAvailableMenu(true);
    try {
      const availablemenutoday = await addAvailableMealToday(
        AppCtx.usermetadata.get_user_id,
        selectedMenuItems
      );
      AppCtx.manipulateTodayKibandaAvailableMenu(availablemenutoday);
      setShowAnimation(false);
      setIcon("check");
      setMessage("Okay");
      // ukweli ni kwamba if nita-quit hii app then ita-ji-refresh vizuri coz all context get back to their default values
      // its goes the same, so we should check how can we clear or make all state in its default on logout
      AppCtx.manipulateIsLoadingAvailableMenu(false);
      // HII ACTION YAKE YA KU-SHOW SPINNNER IN OUR "Dashboard" big Card and TodayMenuCard haitoonekana coz now tupo kwenye
      // AddTodayAvailableMeal screen which is active screen, and at the first it set the spinner to true but now it set it to false
      // but still we're in this screen of AddTodayAvailableMeal and spinner now turned false, so when we go to our Dashboard
      // screen the spinner is already set false, EASY LOGIC
      AppCtx.manipulateIsDefaultMenuSetOnOpen(true); // hii sijui kazi yake ni nini
      AppCtx.manipulateToggleStatus(true); // hi ndo ina-change the image to "open"

      // lets now update in server the kibandaStatus
      updateKibandaStatus({
        user_id: AppCtx.usermetadata.get_user_id,
        status: "true"
      })
      // we added this to see how it behave..

      setTimeout(() => {
        setFormSubmitLoader(false);
        AppCtx.manipulateFetchAgainAvailableMenu(true);
        navigation.navigate("KibandaDashboard");
      });
    } catch (error) {
      setMessage("Server error");
      setIcon("close");
      setShowAnimation(false);
      AppCtx.manipulateIsLoadingAvailableMenu(false);
      AppCtx.manipulateIsDefaultMenuSetOnOpen(false);
      AppCtx.manipulateToggleStatus(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
      });
    }
  };

  function manipulateSelectedMenuItems(metadata) {
    const { menu, status } = metadata;

    if (!status) {
      setSelectedMenuItems((prev) => {
        return prev.filter((item) => +item.id !== +menu.id);
      });
    } else {
      setSelectedMenuItems((prev) => {
        return [...prev, menu];
      });
    }
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View
        style={{
          flex: 1,
          display: formSubmitLoader ? "flex" : "none",
          height: 150,
          width: 150,
          alignSelf: "center",
          position: "absolute",
          top: "40%",
          zIndex: 10,
        }}
      >
        <TransparentPopUpIconMessage
          messageHeader={message}
          icon={icon}
          inProcess={showAnimation}
        />
      </View>
      <View
        style={[
          styles.container,
          {
            width: "100%",
          },
        ]}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <Text style={styles.title}>Add Meals Available Today</Text>
        <HelperText
          padding="none"
          style={{
            color: "grey",
            fontFamily: "overpass-reg",
            marginTop: 0,
            paddingTop: 0,
            marginBottom: "6%",
          }}
        >
          Don't wory you can customize it later.
        </HelperText>
        <ScrollView
          style={{
            width: "90%",
          }}
        >
          <MenuItem
            textStyle={{
              color: "grey",
            }}
            title="Chipsi"
            isDefaultItem={true}
          />
          {menuToManipulate
            .filter((item) => item.singular_name !== "Chipsi")
            .filter((data) => data.type === "menu")
            .map((value, key) => (
              <MenuItem
                key={key}
                title={value.singular_name}
                id={value.id}
                textStyle={{
                  color: "grey",
                }}
                toggledHandler={manipulateSelectedMenuItems}
              />
            ))}
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.secondary,
              fontSize: 20,
              marginTop: "5%",
              marginBottom: "3%",
            }}
          >
            Ingredients
          </Text>
          {menuToManipulate
            .filter((item) => item.singular_name !== "Chipsi")
            .filter((data) => data.type !== "menu")
            .map((value, key) => (
              <MenuItem
                key={key}
                title={value.singular_name}
                id={value.id}
                textStyle={{
                  color: "grey",
                }}
                toggledHandler={manipulateSelectedMenuItems}
              />
            ))}
        </ScrollView>
        <Button
          mode="contained"
          style={{
            backgroundColor: COLORS.secondary,
            marginVertical: "5%",
            marginBottom: "12%",
            borderRadius: 30,
            width: "90%",
          }}
          labelStyle={{
            fontFamily: "montserrat-17",
            fontSize: 16,
            color: COLORS.primary,
          }}
          onPress={addAvailableMealTodayHandler}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

export default memo(AddTodayAvailableMeal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "overpass-reg",
    fontSize: 22,
    color: "grey",
    marginTop: "5%",
  },
});
