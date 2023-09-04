/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet, Keyboard, Platform } from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Background from "../../components/UI/Background";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/colors";
import { Button } from "react-native-paper";
import { validateOTP } from "../../utils/requests";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";

// FOR NOW SIJUI NISIWE NA HII "resend the code" button, i can do it later if they need it, naona habibu pia mwenyewe hajaweka...
function EnterOTPScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };

  const [code, setCode] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const verifyOTPHandler = () => {
    Keyboard.dismiss();
    if (code.length !== 4) {
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    let phone = reset
      ? AppCtx.resetPhoneNumber.phone_number
      : AppCtx.registermetadata.phone_number;
    validateOTP(phone, code)
      .then((result) => {
        if (result.data) {
          if (result.data.message === "OTP validated successfully") {
            setMessage("Okay");
            setIcon("check");
            setTimeout(() => {
              // maybe baadae hii tutaitumia for now its okay...
              // MARA NYINGI SESSION/CONTEXT TUNA-ANZA KUTUNZA STATE YA USER AMBAYE ASHALOGIN SIO YULE AMBAYE BADO..
              AppCtx.manipulateAlreadyValidated(true);
              setFormSubmitLoader(false);
              reset
                ? navigation.navigate("SetPinScreen", {
                    reset: true,
                  })
                : navigation.navigate("SetPinScreen");
            }, 1000);
            setShowAnimation(false);
          } else {
            setMessage("OTP is not valid");
            // alert("OTP is not valid");
            setIcon("close");
            setTimeout(() => {
              setFormSubmitLoader(false);
            }, 1000);
            setShowAnimation(false);
          }
        }
      })
      .catch((error) => {
        alert("Server error in validating OTP");
      });
  };

  return (
    <>
      <StatusBar style="dark" />
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
              <Text style={styles.head}>Jaza nambari ya kuthibitisha</Text>
              {/* hii "selectionColor" ina-change color ya cursor */}
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <OTPInputView
                  onCodeChanged={(msimbo) => setCode(msimbo)}
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
              </View>
              <Button
                mode="contained"
                loading={formSubmitLoader}
                labelStyle={{
                  fontFamily: "montserrat-17",
                }}
                style={{
                  backgroundColor: "grey",
                }}
                onPress={verifyOTPHandler}
              >
                Endelea
              </Button>
            </View>
          </View>
        </Background>
      </View>
    </>
  );
}

export default memo(EnterOTPScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 20,
  },
  head: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: "grey",
    textAlign: "center",
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "black",
  },

  // this helps me to set color of input text https://github.com/tttstudios/react-native-otp-input/issues/73
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
