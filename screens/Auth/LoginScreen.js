/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Background from "../../components/UI/Background";
import { COLORS } from "../../constants/colors";
import { Keyboard } from "react-native";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import {
  fetchCustomerOrders,
  fetchKibandaOrders,
  loginUser,
  userNotifications,
} from "../../utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { BASE_URL } from "../../constants/domain";

function LoginScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { next } = route.params?.next ? route.params : { next: "Setting" };
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const [phone, setPhone] = useState({
    value: AppCtx.lastLoginPhoneNumber ? AppCtx.lastLoginPhoneNumber : "",
    isValid: true,
  });
  const [nywila, setNywila] = useState({
    value: "",
    isValid: true,
  });

  async function loginHandler() {
    Keyboard.dismiss();
    const phoneValid =
      phone.value.trim().length === 10 && phone.value.startsWith("0");
    const nywilaValid = nywila.value.trim().length === 4;

    if (!phoneValid || !nywilaValid) {
      setPhone({ ...phone, isValid: phoneValid });
      setNywila({ ...nywila, isValid: nywilaValid });
      alert("Namba ya simu au password sio sahihi");
      return;
    }

    // everthing is good
    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phone_number = `+255${phone.value.substring(1)}`;
    const password = nywila.value;

    loginUser(phone_number, password)
      .then(async (result) => {
        if (result.data) {
          setMessage("Login successful");
          setIcon("check");
          // what we should do...
          // first we need to save the user id in our storage..
          AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
          AsyncStorage.setItem("phone_number", phone.value.toString());

          // then i think we need to save the metadata in our context
          // set last login context number
          AppCtx.manipulateLastLoginPhoneNumber(phone.value.toString());
          // set usermetada context..
          // HERE IS WHEN WE'RE WRONG THIS I THINK GET TRACKED IF THE USER NEED TO LOGIN IN ORDER TO CONFIRM ORDER BUT NOT OTHERWISE SO WE
          // SHOULD FIX THIS LETS SAY BE USING FLAGS...
          AppCtx.manipulateUserMetadata(result.data);

          // search other metadata like orders and so on...
          // search for notifications..
          const user_id = result.data.get_user_id;
          try {
            const notifications = await userNotifications(user_id);
            AppCtx.updateusernotifications(notifications);
          } catch (error) {
            // hii in most case ni server error, but i thinks it bad intenet
            alert("Failed to connect to server, check your intenet");
            return;
          }

          // search for customer orders
          try {
            const orders = await fetchCustomerOrders(user_id);
            AppCtx.updateCustomerOrdersMetadata(orders);
          } catch (error) {
            alert("Failed to connect to server, check your internet");
            return;
          }

          // if user is kibanda then fetch the kibanda orders
          if (result.data.usergroup === "kibanda") {
            try {
              const orders = await fetchKibandaOrders(user_id);
              AppCtx.updateKibandaOrdersMetadata(orders);
            } catch (error) {
              alert("Failed to connect to server, check your internet");
              return;
            }
          }

          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
            AppCtx.manipulateIsAunthenticated(true);
            // screen: "ConfirmOrder"
            if (next === "Setting") {
              navigation.navigate("Setting");
            } else if (next === "ConfirmOrder") {
              navigation.navigate("Home", {
                screen: "ConfirmOrder",
              });
            }
          }, 1000);
        } else {
         
          setMessage("Invalid credentials"); 
          setIcon("close");
          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
          }, 1000);
        }
      })
      .catch((err) => {
        // remember we don't have "data" attribute if the credentials is invalid
        // in some case user can login but his account has no any profile associated
        // with it... For that case lets tell the user the account is already deleted
        // so he should create another one..
        let message = "Request failed"
        if (err.error.message.toLowerCase().includes("Unrecognized user".toLowerCase())) {
          // we can't know the "user_id" because if user tried to login, but what we'll do we'll
          // delete the account at the server and give the user account is nowhere to be found.
          // but if we delete the user successful to the server at first time we have the 
          // "Account not found" then after being deleted we have "Invalid Credentails" error 
          // message for us to be "static" we should have only one message for me its i think 
          // i should pick "Invalid Credential"
          message = "Invalid credentials"
        }
        // console.log('error occured ', err)
        setMessage(message);
        setIcon("close");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
      });
  }

  return (
    <Background>
      <View
        style={[
          styles.container,
          {
            position: "relative",
          },
        ]}
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
          <Text style={styles.title}>Ingia kwenye Akaunti</Text>

          <View style={styles.formInput}>
            <TextInput
              label="Jaza Namba ya Simu"
              maxLength={10}
              placeholder="07XXXXXXXX"
              mode="outlined"
              value={phone.value}
              onChangeText={(text) => setPhone({ value: text, isValid: true })}
              keyboardType="numeric"
              style={styles.formInput}
              activeOutlineColor={phone.isValid ? "#495057" : "red"}
              outlineColor={phone.isValid ? "grey" : "red"}
            />
          </View>
          <View style={styles.formInput}>
            <TextInput
              label="Jaza PIN"
              maxLength={4}
              mode="outlined"
              value={nywila.value}
              onChangeText={(text) => setNywila({ value: text, isValid: true })}
              keyboardType="numeric"
              style={styles.formInput}
              activeOutlineColor={nywila.isValid ? "#495057" : "red"}
              outlineColor={nywila.isValid ? "grey" : "red"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register", {
                  ugroup: undefined,
                })
              }
              style={{
                alignSelf: "flex-end",
                marginVertical: 15,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  textDecorationColor: COLORS.danger,
                  textDecorationLine: "underline",
                  color: COLORS.danger,
                }}
              >
                Fungua Akaunti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={{
                alignSelf: "flex-end",
                marginVertical: 15,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  textDecorationColor: "#495057",
                  textDecorationLine: "underline",
                  color: "#495057",
                }}
              >
                Umesahau PIN?
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            buttonColor={"grey"}
            textColor={COLORS.primary}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            mode="contained"
            onPress={loginHandler}
          >
            Ingia
          </Button>
        </View>
      </View>
    </Background>
  );
}

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontFamily: "montserrat-17",
    color: COLORS.primary,
    fontSize: 20,
  },
  formInput: {
    marginVertical: "2%",
  },
});
