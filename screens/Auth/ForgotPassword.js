/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import Background from "../../components/UI/Background";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import { COLORS } from "../../constants/colors";
import { getOTP, isUserExist } from "../../utils/requests";
import { AppContext } from "../../store/context";

function ForgotPassword({ color, navigation, route }) {
  const AppCtx = useContext(AppContext);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [phone, setPhone] = useState({
    value: "",
    isValid: true,
  });

  async function resetHandler() {
    Keyboard.dismiss();
    const phoneValid = phone.value.length === 10 && phone.value.startsWith("0");

    if (!phoneValid) {
      alert("Namba ya simu sio sahihi, fomati 0XXXXXXXXX");
      return;
    }

    // everthing is good
    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phone_number = `+255${phone.value.substring(1)}`;

    // before validate if there is a user of that phone number...
    const data = await isUserExist(phone_number);


    if (data.message === "User does not exist") {
      alert("User does not exist");
      setFormSubmitLoader(false);
      setShowAnimation(false);
      return;
    }

    const user_id = data.user_id;
    const user_group = data.user_group;
    AppCtx.manipulateResetPhoneNumber({ user_id, user_group });

    getOTP(phone_number)
      .then((result) => {
        if (result.data) {
          const metadata = {
            phone_number,
            otp: result.data.OTP,
          };

          AppCtx.manipulateResetPhoneNumber(metadata);
          setTimeout(() => {
            setFormSubmitLoader(false);
            navigation.navigate("VerifyOTPScreen", {
              reset: true,
            });
          }, 1000);
          setShowAnimation(false);
        }
      })
      .catch((error) => {
        setFormSubmitLoader(false);
        setShowAnimation(false);
        alert("Server failed to send OTP");
      });
  }

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <StatusBar style="dark" />
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
          messageHeader="Okay"
          icon="check"
          inProcess={showAnimation}
        />
      </View>

      <Background>
        <View
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{"WEKA TAARIFA"}</Text>
            <View style={styles.formInput}>
              <TextInput
                label="Jaza Namba ya Simu"
                maxLength={10}
                placeholder="0XXXXXXXXX"
                value={phone.value}
                onChangeText={(text) =>
                  setPhone({ value: text, isValid: true })
                }
                keyboardType="numeric"
                style={styles.formInput}
                activeUnderlineColor={phone.isValid ? "#495057" : "red"}
                underlineColor={phone.isValid ? "grey" : "red"}
              />
            </View>
            <Button
              loading={formSubmitLoader}
              buttonColor={"grey"}
              textColor={COLORS.primary}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              mode="contained"
              onPress={resetHandler}
            >
              {"Endelea"}
            </Button>
          </View>
        </View>
      </Background>
    </View>
  );
}

export default memo(ForgotPassword);

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
