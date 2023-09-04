/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import { Picker } from "@react-native-picker/picker";
import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Background from "../../components/UI/Background";
import { COLORS } from "../../constants/colors";
import { Keyboard } from "react-native";
import { AppContext } from "../../store/context";
import { getOTP } from "../../utils/requests";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";

function RegisterScreen({ route, navigation }) {
  const { ugroup } = route.params;
  const AppCtx = useContext(AppContext);

  const [userGroupIcons, setUserGroupIcons] = useState("chevron-down");
  const [toggleUserGroup, setToggleUserGroup] = useState("none");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const [usergroup, setUserGroup] = useState("MTEJA");
  const [phone, setPhone] = useState({
    value: "",
    isValid: true,
  });

  async function jisajiliHandler() {
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
    const group = usergroup === "MTEJA" ? "customer" : "kibanda";

    getOTP(phone_number)
      .then((result) => {
        if (result.data) {
          const metadata = {
            phone_number,
            usergroup: group,
            otp: result.data.OTP,
          };

          AppCtx.addRegisterMetadata(metadata);
          setTimeout(() => {
            setFormSubmitLoader(false);
            navigation.navigate("VerifyOTPScreen");
          }, 1000);
          setShowAnimation(false);
        }
      })
      .catch((error) => {
        setFormSubmitLoader(false);
        setShowAnimation(false);
        alert("Kuna tatizo, jaribu tena baadae");
      });
  }

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
              messageHeader="Okay"
              icon="check"
              inProcess={showAnimation}
            />
          </View>

          <View style={styles.innerContainer}>
            <Text style={styles.title}>
              {ugroup ? "WEKA TAARIFA" : "FUNGUA AKAUNTI"}
            </Text>
            {!ugroup && (
              <View style={styles.formInput}>
                {Platform.OS === "ios" ? (
                  <>
                    <Pressable
                      onPress={() => {
                        if (toggleUserGroup === "none") {
                          setToggleUserGroup("flex");
                          setUserGroupIcons("chevron-up");
                          Keyboard.dismiss();
                        } else {
                          setToggleUserGroup("none");
                          setUserGroupIcons("chevron-down");
                        }
                      }}
                    >
                      <View pointerEvents="none">
                        <TextInput
                          label="Chagua Aina ya Akaunti"
                          textColor="black"
                          editable={false}
                          value={usergroup}
                          style={styles.formInput}
                          right={<TextInput.Icon icon={userGroupIcons} />}
                          activeOutlineColor={COLORS.primary}
                          outlineColor={COLORS.primary}
                        />
                      </View>
                    </Pressable>
                    <Picker
                      mode="dropdown"
                      selectedValue={usergroup}
                      onValueChange={(text) => setUserGroup(text)}
                      style={[
                        styles.pickerStyling,
                        { display: toggleUserGroup },
                      ]}
                    >
                      <Picker.Item label="MTEJA" value="MTEJA" />
                      <Picker.Item label="MGAHAWA" value="MGAHAWA" />
                    </Picker>
                  </>
                ) : (
                  <>
                    <View style={{ marginTop: "2%" }}>
                      <Text style={{ marginLeft: "3%" }}>
                        Chagua Aina ya Akaunti
                      </Text>
                      <View
                        style={{
                          borderColor: "white",
                          borderRadius: 5,
                          borderWidth: 1,
                        }}
                      >
                        <Picker
                          mode="dropdown"
                          style={{
                            backgroundColor: "white",
                          }}
                          selectedValue={usergroup}
                          onValueChange={(text) => setUserGroup(text)}
                        >
                          <Picker.Item label="MTEJA" value="MTEJA" />
                          <Picker.Item label="MGAHAWA" value="MGAHAWA" />
                        </Picker>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}
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
                onFocus={() => {
                  if (toggleUserGroup === "flex") {
                    setToggleUserGroup("none");
                    setUserGroupIcons("chevron-down");
                  }
                }}
              />
            </View>
            <Button
              buttonColor={"grey"}
              textColor={COLORS.primary}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              mode="contained"
              onPress={jisajiliHandler}
            >
              {ugroup ? "Endelea" : "Jisajili"}
            </Button>
          </View>
        </View>
      </Background>
    </View>
  );
}

export default memo(RegisterScreen);

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
