/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet, Keyboard, Platform } from "react-native";
import Background from "../../components/UI/Background";
import { COLORS } from "../../constants/colors";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button } from "react-native-paper";
import * as Device from "expo-device";
import {
  executeUserMetadata,
  fetchCustomerOrders,
  fetchKibandaOrders,
  registerUser,
  userNotifications,
} from "../../utils/requests";
import { AppContext } from "../../store/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import { BASE_URL } from "../../constants/domain";

/*
  coz we need to eject 'expo' to base flow which is bad so as to use native modules of react-native-device-info to 
  get the uniqueDeviceId of the device since 'expo-device' module does not provide that functionality.. we need to 
  eject.. for me its not something i want 
*/

function SetLoginPin({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };

  const [PIN, setPIN] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const savepinHandler = async () => {
    Keyboard.dismiss();
    if (PIN.length !== 4) {
      return;
    }
    setFormSubmitLoader(true);
    setShowAnimation(true);

    if (reset) {
      // set is Aunthenticated true
      // then fetch the orders
      // then fetch the notifications
      // then fetch the user metadata
      // hapa inabidi tuwe tiari tusha-mverify user kama yupo..
      const { user_id } = AppCtx.resetPhoneNumber;
      await AsyncStorage.setItem("user_id", user_id.toString());
      // we store that we should fetch all things from the server
      try {
        const metadata = await executeUserMetadata(user_id);
        AppCtx.manipulateUserMetadata(metadata);
      } catch (err) {
        if (err.message.toLowerCase().includes("Unrecognized user".toLowerCase())) {
          const splitted = err.message.split(" ")
          const user_id = splitted[splitted.length - 1]
          fetch(`${BASE_URL}/api/delete_user/`, {
            method: "POST",
            body: JSON.stringify({
              user_id
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
          // lets logout 
          AppCtx.logout();
          alert("Your account have been deleted, register again.")
        }
        else {
          alert(err.message);
        }
        return;
      }

      // then lets fetch the user_notifications
      try {
        const notifications = await userNotifications(user_id);
        AppCtx.updateusernotifications(notifications);
      } catch (error) {
        alert("Failed to connect to server, check your connection");
        return;
      }

      // then lets fetch the orders
      // let me fetch the user orders from the backend...
      try {
        const orders = await fetchCustomerOrders(user_id);
        AppCtx.updateCustomerOrdersMetadata(orders);
      } catch (error) {
        alert("Failed to connect to server, check your connection");
        return;
      }

      // then if we have the user_group of "kibanda" lets fetch his orders..
      const { user_group } = AppCtx.resetPhoneNumber;
      if (user_group.toLowerCase() === "kibanda") {
        try {
          const orders = await fetchKibandaOrders(user_id);
          AppCtx.updateKibandaOrdersMetadata(orders);
        } catch (error) {
          alert("Failed to connect to server, check your connection");
          return;
        }
      }

      // we fetched all required data from the server
      // then we set isAunthenticated to true
      setShowAnimation(false);
      setFormSubmitLoader(false);
      AppCtx.manipulateIsAunthenticated(true);

      navigation.navigate("Setting");
      return;
    }

    // hii osBuildId sizani kama ni unique for all devices but for now lets go with this countermeasure
    // https://stackoverflow.com/questions/13471283/is-android-os-build-serial-unique
    const uniqueDeviceId = Device.osBuildId;
    const phone_number = AppCtx.registermetadata.phone_number;
    const usergroup = AppCtx.registermetadata.usergroup;

    registerUser(phone_number, usergroup, PIN, uniqueDeviceId)
      .then((result) => {
        // i expect result.data here to be resolved then check for the usergroup ..

        if (result.data.usergroup.toLowerCase() === "customer") {
          // we should redirect to the customer dashboard.. this will be redirected automatically because we set isAunthenticated to True
          setMessage("Imefanikiwa");
          setIcon("check");

          setTimeout(() => {
            setFormSubmitLoader(false);
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number
              .toString()
              .replace("+255", "0");
            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);
            if (AppCtx.afterLoginNext === "PlaceOrder") {
              return navigation.navigate("Home", {
                screen: "ConfirmOrder",
              });
            }
            navigation.navigate("Settings");
          }, 1000);
          setShowAnimation(false);
        } else if (result.data.usergroup.toLowerCase() === "kibanda") {
          setMessage("Imefanikiwa");
          setIcon("check");
          setTimeout(() => {
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number
              .toString()
              .replace("+255", "0");
            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);
            setFormSubmitLoader(false);
            navigation.navigate("CompleteKibandaProfile");
          }, 1000);
          setShowAnimation(false);
        } else {
          // hii ni ngumu kutokea
        }
      })
      .catch((err) => {
        // alert("kuna tatizo, jaribu tena baadae");
        if (err.error.message === "Namba ishasajiliwa") {
          setMessage("Namba Ishatumika")
        }
        else {
          setMessage("Imefeli");
        }
        setIcon("close");
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
        setShowAnimation(false);
        // alert("there was an error registering you, please try again later");
      });
  };

  // HUWEZI KUTUMIA APP BILA KU-UPDATE

  // 0625082158
  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <Background>
        <View
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
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

          <View style={styles.innerContainer}>
            <Text style={styles.header}>Weka PIN mpya ya kutumia</Text>
            <OTPInputView
              onCodeChanged={(msimbo) => setPIN(msimbo)}
              selectionColor={COLORS.primary}
              style={{
                width: "80%",
                height: 100,
                color: "grey",
              }}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              autoFocusOnLoad={false}
              pinCount={4}
            />
            <Button
              mode="contained"
              loading={formSubmitLoader}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                backgroundColor: "grey",
              }}
              onPress={savepinHandler}
            >
              Thibitisha
            </Button>
          </View>
        </View>
      </Background>
    </View>
  );
}

export default memo(SetLoginPin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: "grey",
  },
  underlineStyleBase: {
    width: 50,
    height: 55,
    borderColor: "grey",
    color: "grey",
    borderWidth: 2,
  },

  underlineStyleHighLighted: {
    borderColor: COLORS.primary,
  },
});
