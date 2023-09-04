/* eslint-disable no-sparse-arrays */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { Foundation } from "@expo/vector-icons";
import React, { memo, useContext, useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import * as ImageCache from "react-native-expo-image-cache";
import { Button, HelperText, Modal, TextInput } from "react-native-paper";
import CustomLine from "../../components/UI/CustomLine";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import { COLORS } from "../../constants/colors";
import { BASE_URL } from "../../constants/domain";
import { AppContext } from "../../store/context";
import {
  executeUserMetadata,
  fetchCustomerOrders,
  fetchKibandaOrders,
  isUserExist,
  placeOrder,
  userNotifications,
} from "../../utils/requests";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ConfirmOrder({ navigation }) {
  const AppCtx = useContext(AppContext);
  let { cart } = AppCtx;
  cart = cart[cart.length - 1];
  const preview = {
    uri: `${BASE_URL}${cart.kibandametadata.get_cover_photo}`,
  };
  const uri = `${BASE_URL}${cart.kibandametadata.get_cover_photo}`;

  const [displayLoginDialogue, setDisplayLoginDialogue] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(
    AppCtx.usermetadata.phone_number
  );
  const [enteredPhone, setEnteredPhone] = useState({
    value: "",
    isValid: true,
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  // YOU CAN REMOVE THIS LOGIC IF IT DOES NOT MAKE SENSE
  const checkValidityOfUserIfExisted = async () => {
    try {
      // Is our source of user id is "AppCtx.usermetadata" or i should 
      // also use the stored id if i don't have the "metadata"..
      // hadi mtu yupo humu ujue "usermetadata" ipo..
      const user_id = AppCtx.usermetadata ? AppCtx.usermetadata.get_user_id : await AsyncStorage.getItem("user_id")
      if (!user_id) {
        throw new Error("No source of user_id")
      }
      await executeUserMetadata(user_id)
    }
    catch(err) {
      console.log("HIS IS OUR ERROR HERE, it say INTERNAL SERVER ERROR WHEN IT TRY TO CALL executeUserMetada", err)
      if (err.message.toLowerCase().includes("Unrecognized user".toLowerCase())) {
        const splitted = err.message.split(" ")
        const user_id = splitted[splitted.length - 1]
        fetch(`${BASE_URL}/api/delete_user/`, {
          method: "POST",
          body: JSON.stringify({
            user_id
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => response.json()).then(data => console.log("THIS IS RESOLVED RESPONSE ", data)).catch(err => console.log("THIS IS ERROR MESSAGE ", err.message))        
        AppCtx.logout();
      }
      else {
        // for anycase just call logout function..
        AppCtx.logout()
      }
    }
  }

  const makeSureYouExecutedItFully = async () => {
    await checkValidityOfUserIfExisted()
  }

  useEffect(() => {
    makeSureYouExecutedItFully()
  }, [])

  // END OF LOGIC TO REMOVE IF IT DEOES NOT MAKE SENSE

  function ItemPrice({ title, price, containerStyle }) {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
          },
          containerStyle,
        ]}
      >
        <Text
          style={{
            fontFamily: "overpass-reg",
            color: "grey",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "montserrat-17",
            color: "grey",
          }}
        >
          {price}
        </Text>
      </View>
    );
  }

  function scheduleNotificationHandler(data) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Order Placed Success",
        body: "Your order made to Kibanda has been placed successfully",
        data: { data },
      },
      trigger: { seconds: 5 },
    });
  }


  // humu kuna errors za "FirebaseApp" is not initialized mbili i think ndo method iwe quitted automatically, 
  // kama tuta-build apk then hii error bado ina-exist inabidi tu-update hii method ya kuadd hizi token iwe
  // executed once on mounting kote in "dashboard.js" and everywhere we fetching the token aso it should be 
  // in try catch block
  async function placeOrderHandler() {
    

    // in some case user can be still try to placeorder if he/she logout for this case you should re-direct to login 
    // screen and in most chance he've account since last time he navigate to this page after completing the order..
    if (!AppCtx.isAunthenticated) {
      return navigation.navigate("Settings", {
        screen: "Login"
      })
    }
    
    setShowAnimation(true);
    setFormSubmitLoader(true);
    // handle logics to check if restaurant exist or not..
    // we have kibanda phone number here cart.kibandametadata.phone_number
    isUserExist(cart.kibandametadata.phone_number).then(async (data) => {
      if (data.message === "User exist") {
        try {
          const order = await placeOrder(
            +AppCtx.usermetadata.get_user_id,
            cart,
            customerPhone
          );
          AppCtx.manipulateCustomerOrders(order);

          // lets fetch all the things require, customer order, notifications and kibanda orders
          const user_id = AppCtx.usermetadata.get_user_id;
          try {
            const notifications = await userNotifications(+user_id);
            AppCtx.updateusernotifications(notifications);
          } catch (error) {
            console.log('IM THE FIRST ONE ALERT')
            alert(error);
          }
          try {
            const customerorders = await fetchCustomerOrders(+user_id);
            AppCtx.updateCustomerOrdersMetadata(customerorders);
          } catch (error) {
            console.log("IM THE SECOND ONE ALERT")
            alert(error);
          }

          // can you update the customer orders for me, HII NDO INALETA ERROR COZ HOW CAN WE UPDATE THE
          // KIBANDA DATA IF WE DON'T KNOW IF THE ONE PLACED ORDER IS "kibanda" or "customer", THIS HAPPEN
          // IF YOU TRY TO PLACE ORDER AS THE CUSTOMER AND NOT KIBANDA FOR KIBANDA THIS WORK FINE...
          // if user amefaulu ku-place order then ana AppCtx.usermetada
          if (AppCtx.usermetadata.usergroup.toLowerCase() === "kibanda") {
            console.log("IM THE KIBANDA....")
            try {
              const kibandaorders = await fetchKibandaOrders(+user_id);
              AppCtx.updateKibandaOrdersMetadata(kibandaorders);
            } catch (error) {
              console.log("IM THE THIRD ONE ALERT")
              alert(error.message);
            }
          }

          // for best practice les also fetch and update the customer orders and kibanda
          // orders..
          /*
            i think we should send notification from the backend instead of locally
            because order can be locally placed but not sent to the backend, so this
            is why i commented this local notification line

            // scheduleNotificationHandler(order);
          */
          setMessage("Success");
          setIcon("check");
          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
            // make sure you make the Order Tab refreshed
            AppCtx.manipulateActiveCustomerOrderTabNotification(0)
            AppCtx.manipulateActiveCustomerOrderMetadata({
              tab: "Pending Orders",
              shouldRefresh: true,
            });
            navigation.navigate("Settings", {
              screen: "MtejaOrders",
            });
          }, 1000);
        } catch (error) {
          setMessage("Failed");
          setIcon("close");
          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
          }, 1000);
        }
      }
      else {
        setShowAnimation(false);
        setFormSubmitLoader(false);
        Alert.alert(
          "Restaurant not found",
          "It seem the restaurant you're trying to access is no longer found, pick another one.",
          [ 
            {
              text: "Okay",
              onPress: () => {
                // its okay if we move directly from this to HomeScreen
                AppCtx.manipulateShowLoadingSpinner(false);
                AppCtx.manipulateShowLoadingSpinner2(true);
                setTimeout(() => {
                  navigation.navigate("HomeScreen");
                }, 50);
              }
            }
          ]
        )
        // alert("Sorry, restaurant has been deleted!")
      }
    }).catch(err => {
      console.log("something went wrong")
      setShowAnimation(false);
      setFormSubmitLoader(false);
      alert(err.message)
    })
  }
  return (
    <>
      <View style={{ flex: 1, position: "relative" }}>
        <Modal
          visible={displayLoginDialogue}
          onDismiss={() => {
            setEnteredPhone((prevState) => ({
              ...prevState,
              value: "",
              isValid: true,
            }));
            setDisplayLoginDialogue(false);
          }}
          contentContainerStyle={{
            width: "90%",
            height: 200,
            backgroundColor: "white",
            borderRadius: 10,
            alignSelf: "center",
            position: "absolute",
            top: "20%",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              textAlign: "center",
              fontSize: 20,
              marginBottom: "5%",
            }}
          >
            Set New Phone Number
          </Text>
          <TextInput
            style={{
              width: "90%",
              alignSelf: "center",
              marginBottom: "5%",
            }}
            placeholder="0XXXXXXXXX"
            keyboardType="number-pad"
            activeUnderlineColor={enteredPhone.isValid ? "grey" : "red"}
            underlineColor={enteredPhone.isValid ? "grey" : "red"}
            maxLength={10}
            label="Phone Number"
            value={enteredPhone.value}
            onChangeText={(text) =>
              setEnteredPhone((prevState) => ({
                ...prevState,
                value: text,
                isValid: true,
              }))
            }
          />
          <Button
            mode="contained"
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            onPress={() => {
              const phoneValid = enteredPhone.value.length === 10;
              if (!phoneValid) {
                setEnteredPhone((prevState) => ({
                  ...prevState,
                  isValid: false,
                }));
                return;
              }
              setCustomerPhone(enteredPhone.value.replace("0", "+255"));
              setEnteredPhone((prevState) => ({
                ...prevState,
                value: "",
                isValid: true,
              }));
              setDisplayLoginDialogue(false);
            }}
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: COLORS.secondary,
            }}
          >
            Submit
          </Button>
        </Modal>
        <View
          style={{
            display: formSubmitLoader ? "flex" : "none",
            position: "absolute",
            top: "40%",
            zIndex: 10000000000,
            alignSelf: "center",
            width: 150,
            height: 150,
            justifyContent: "center",
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader={message}
            icon={icon}
            inProcess={showAnimation}
          />
        </View>
        <View
          pointerEvents={
            formSubmitLoader || displayLoginDialogue ? "none" : "auto"
          }
          style={[
            styles.container,
            displayLoginDialogue
              ? {
                  opacity: 0.05,
                }
              : {
                  opacity: 1,
                },
          ]}
        >
          <ScrollView
            style={[styles.container]}
            pointerEvents={formSubmitLoader ? "none" : "auto"}
          >
            <View
              style={[
                {
                  flex: 1,
                },
              ]}
            >
              <View>
                <Text
                  style={{
                    color: "grey",
                    fontFamily: "montserrat-17",
                  }}
                >
                  Restaurant Info
                </Text>
                <View
                  style={{
                    marginVertical: "2%",
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <ImageCache.Image
                    tint="light"
                    transitionDuration={100}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50 / 2,
                      borderColor: COLORS.secondary,
                      borderWidth: 2,
                    }}
                    {...{ preview, uri }}
                  />
                  <View
                    style={{
                      marginLeft: "3%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "overpass-reg",
                        fontSize: 18,
                      }}
                    >
                      {cart.kibandametadata.brand_name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "montserrat-17",
                        color: "grey",
                      }}
                    >
                      Phone: {cart.kibandametadata.phone_number}
                    </Text>
                  </View>
                </View>
                <CustomLine
                  style={{
                    marginTop: "1%",
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginVertical: "2%",
                }}
              >
                <View>
                  <Foundation
                    name="telephone"
                    size={20}
                    color={COLORS.secondary}
                  />
                </View>
                <View
                  style={{
                    marginLeft: "2%",
                    width: "75%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "overpass-reg",
                      fontSize: 16,
                    }}
                  >
                    My Phone number
                  </Text>
                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "montserrat-17",
                    }}
                  >
                    {customerPhone}
                  </Text>
                  <HelperText
                    padding="none"
                    style={{
                      color: "grey",
                      lineHeight: 13,
                    }}
                  >
                    This phone number will be used in delivery process.
                  </HelperText>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setDisplayLoginDialogue(true);
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.secondary,
                        fontFamily: "montserrat-17",
                      }}
                    >
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <CustomLine />
              <View>
                <ItemPrice
                  containerStyle={{
                    margin: "2%",
                  }}
                  title={"Total Menu Price"}
                  price={`Tsh ${cart.metadata
                    .map((item) => +item.totalPrice)
                    .reduce((total, num) => total + num, 0)}/=`}
                />
                <ItemPrice
                  containerStyle={{
                    margin: "2%",
                  }}
                  title={"Delivery Charge"}
                  price={"negotiable"}
                />
                <Button
                  onPress={placeOrderHandler}
                  mode="contained"
                  labelStyle={{
                    fontFamily: "montserrat-17",
                  }}
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderRadius: 10,
                    marginVertical: "5%",
                  }}
                >
                  Confirm Order
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

export default memo(ConfirmOrder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 30,
  },
});
