/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import Background from "../UI/Background";
import MenuItem from "../UI/MenuItem";
import { AppContext } from "../../store/context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import CustomLine from "../UI/CustomLine";
import MenuPrice from "../UI/MenuPrice";
import { TransparentPopUpIconMessage } from "../UI/Message";
import { addKibandaDefaultMenu } from "../../utils/requests";

function DefaultMeal({ navigation }) {
  const AppCtx = useContext(AppContext);
  const [displayPage1, setDisplayPage1] = useState(true);
  const [displayPage2, setDisplayPage2] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

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

  function updatePriceOfMenuItemHandler({ id, price }) {
    setSelectedMenuItems((prev) => {
      return prev.map((item) => {
        if (+item.id === +id) {
          return { ...item, price };
        }
        return item;
      });
    });
  }

  function goToAddPriceHandler() {
    setDisplayPage1(false);
    setDisplayPage2(true);
  }

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
  // 0659242027
  function submitFavoriteMeals() {
    Keyboard.dismiss();
    setShowAnimation(true);
    setFormSubmitLoader(true);
    const prices = selectedMenuItems
      .filter((data) => data.type === "menu")
      .map((item) => item.price);
    if (
      prices.includes(null) ||
      prices.find((item) => isNaN(+item)) ||
      prices.find((item) => item.includes("."))
    ) {
      setMessage("Incorrect Prices");
      setIcon("close");
      setTimeout(() => {
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
        setShowAnimation(false);
      }, 1000);
      return;
    }

    // everything is okay..
    const user_id = AppCtx.usermetadata.get_user_id;
    addKibandaDefaultMenu(+user_id, selectedMenuItems)
      .then((result) => {
        AppCtx.manipulateUserMetadata({
          is_default_meal_added: true,
        });
        AppCtx.manipulateDefaultKibandaMenu(result);
        setMessage("Okay");
        setIcon("check");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          navigation.navigate("KibandaDashboard");
        }, 1000);
      })
      .catch((error) => {
        alert("Connection Error, check your internet")
      });
  }

  return (
    <Background>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
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
          style={{
            width: "100%",
          }}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[!displayPage1 && { display: "none" }]}
          >
            <View style={[styles.container]}>
              <Text style={styles.title}>To Get Started Add Your Meal</Text>
              <HelperText
                padding="none"
                style={{
                  color: COLORS.primary,
                  fontFamily: "montserrat-14",
                  marginTop: 0,
                  paddingTop: 0,
                  marginBottom: "6%",
                }}
              >
                ** Add your frequently menu, you can customize it later.
              </HelperText>
              <ScrollView>
                <MenuItem title="Chipsi" isDefaultItem={true} />
                {AppCtx.menuAddedByAdministratorForRestaurantsToChoose
                  .filter((item) => item.singular_name !== "Chipsi")
                  .filter((data) => data.type === "menu")
                  .map((value, key) => (
                    <MenuItem
                      key={key}
                      title={value.singular_name}
                      type={value.type}
                      id={value.id}
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
                {AppCtx.menuAddedByAdministratorForRestaurantsToChoose
                  .filter((item) => item.singular_name !== "Chipsi")
                  .filter((data) => data.type !== "menu")
                  .map((value, key) => (
                    <MenuItem
                      key={key}
                      title={value.singular_name}
                      type={value.type}
                      id={value.id}
                      toggledHandler={manipulateSelectedMenuItems}
                    />
                  ))}
              </ScrollView>
              <Button
                mode="contained"
                style={{
                  backgroundColor: COLORS.secondary,
                  marginTop: "5%",
                  borderRadius: 30,
                }}
                labelStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 16,
                  color: COLORS.primary,
                }}
                onPress={goToAddPriceHandler}
              >
                Continue
              </Button>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[{ width: "100%" }, !displayPage2 && { display: "none" }]}
          >
            <View style={[styles.container1]}>
              <Text style={[styles.title, { marginTop: "3%" }]}>
                How Much Each Item Cost
              </Text>
              <HelperText
                padding="none"
                style={{
                  color: COLORS.primary,
                  fontFamily: "montserrat-14",
                  marginTop: 0,
                  paddingTop: 0,
                }}
              >
                ** Bei hii ndo itakayoonekana kwa wateja wako.
              </HelperText>
              <CustomLine />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <HelperText
                  padding="none"
                  style={{
                    color: COLORS.primary,
                    fontFamily: "montserrat-15",
                  }}
                >
                  Need to edit menu items?
                </HelperText>
                <TouchableOpacity
                  style={{
                    marginLeft: "1%",
                  }}
                  onPress={() => {
                    Keyboard.dismiss();
                    setDisplayPage1(true);
                    setDisplayPage2(false);
                  }}
                >
                  <HelperText
                    padding="none"
                    style={{
                      color: COLORS.secondary,
                      fontFamily: "montserrat-17",
                    }}
                  >
                    Click here
                  </HelperText>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  {selectedMenuItems
                    .filter((menu) => menu.type === "menu")
                    .map((value, key) => (
                      <MenuPrice
                        onChangeHandler={updatePriceOfMenuItemHandler}
                        key={key}
                        title={value.name}
                        id={value.id}
                      />
                    ))}
                  
                </KeyboardAvoidingView>
                <View
                  style={{
                    height:500,
                  }}
                ></View>
              </ScrollView>
              <Button
                mode="contained"
                style={{
                  backgroundColor: COLORS.secondary,
                  marginTop: "5%",
                  borderRadius: 30,
                }}
                labelStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 16,
                  color: COLORS.primary,
                }}
                onPress={submitFavoriteMeals}
              >
                Finish
              </Button>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Background>
  );
}

export default memo(DefaultMeal);

const styles = StyleSheet.create({
  container: {
    marginVertical: "8%",
    width: "94%",
    height: "92%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container1: {
    width: "92%",
    height: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  title: {
    fontFamily: "montserrat-17",
    fontSize: 22,
    color: COLORS.secondary,
    marginTop: "5%",
  },
});
