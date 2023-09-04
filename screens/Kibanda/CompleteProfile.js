/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState, useContext } from "react";
import { Button, TextInput } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "../../components/UI/ImagePicker";
import CoverPhoto from "../../components/UI/CoverPicker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { AppContext } from "../../store/context";
import {
  CustomizedLottieMessage,
  TransparentPopUpIconMessage,
} from "../../components/UI/Message";
import { BASE_URL } from "../../constants/domain";
function CompleteProfile({ navigation }) {
  const AppCtx = useContext(AppContext);

  const [idTypeIcon, setIdTypeIcon] = useState("chevron-down");
  const [toggleIdType, setToggleIdType] = useState("none");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [showNeedPermission, setShowNeedPermission] = useState(false);

  const [fname, setFname] = useState({
    value: "",
    isValid: true,
  });

  const [lname, setLname] = useState({
    value: "",
    isValid: true,
  });

  const [brand, setBrand] = useState({
    value: "",
    isValid: true,
  });

  const [pickedImage, setPickedImage] = useState({
    value: undefined,
    isValid: true,
  });

  const [coverImage, setCoverImage] = useState({
    value: undefined,
    isValid: true,
  });

  const [ainayaid, setAinayaid] = useState({
    value: "NIDA",
    isValid: true,
  });

  const [idnumber, setIdnumber] = useState({
    value: "",
    isValid: true,
  });

  const [errorMsg, setErrorMsg] = useState(null);

  const checkForPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus;
  };

  // useEffect(() => {
  //   async function configurePushNotificatons() {
  //     const finalStatus = await checkForPermission();

  //     if (finalStatus !== "granted") {
  //       return;
  //     }

  //     const pushToken = await Notifications.getExpoPushTokenAsync();

  //     // for android to work receive push notification we should specify channel
  //     if (Platform.OS === "android") {
  //       Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.HIGH,
  //       });
  //     }

  //     fetch(`${BASE_URL}/api/savedevicenotificationtoken/`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         user_id: AppCtx.usermetadata.get_user_id,
  //         token: pushToken.data,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   }

  //   configurePushNotificatons();
  // });

  useEffect(() => {
    async function configurePushNotificatons() {
      try {
        const finalStatus = await checkForPermission();
  
        if (finalStatus !== "granted") {
          return;
        }
  
        const pushToken = await Notifications.getExpoPushTokenAsync();
  
        // for android to work receive push notification we should specify channel
        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
          });
        }
  
  
        fetch(`${BASE_URL}/api/savedevicenotificationtoken/`, {
          method: "POST",
          body: JSON.stringify({
            user_id: AppCtx.usermetadata.get_user_id,
            token: pushToken.data,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error in configurePushNotificatons:", error);
      }
    }
  
    configurePushNotificatons();
  });
  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("You should allow location access to complete profile.");
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = [location.coords.latitude, location.coords.longitude];
      AppCtx.addinitialCoords(coords);
    })();
  }, []);
  // acha hivihivi ukitoa [] kwenye useEffect inaleta error

  function profileHandler(image) {
    setPickedImage((prevState) => {
      return { ...prevState, value: image, isValid: true };
    });
  }

  async function saveMetadatahHandler() {
    Keyboard.dismiss();
    // if user didn't allow notification permission
    const finalStatus = await checkForPermission();
    if (finalStatus !== "granted") {
      setShowNeedPermission(true);
      return;
    }
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    setFormSubmitLoader(true);
    setShowAnimation(true);

    const fnameValid = fname.value.trim().length > 0;
    const lnameValid = lname.value.trim().length > 0;
    const brandValid = brand.value.trim().length > 0;
    const idnumberValid = idnumber.value.trim().length > 10;
    const pickedImageValid = pickedImage.value !== undefined;
    const coverImageValid = coverImage.value !== undefined;

    if (
      !fnameValid ||
      !lnameValid ||
      !brandValid ||
      !idnumberValid ||
      !pickedImageValid ||
      !coverImageValid
    ) {
      setFname((prevState) => {
        return { ...prevState, isValid: fnameValid };
      });
      setLname((prevState) => {
        return { ...prevState, isValid: lnameValid };
      });
      setBrand((prevState) => {
        return { ...prevState, isValid: brandValid };
      });
      setIdnumber((prevState) => {
        return { ...prevState, isValid: idnumberValid };
      });
      setPickedImage((prevState) => {
        return { ...prevState, isValid: pickedImageValid };
      });
      setCoverImage((prevState) => {
        return { ...prevState, isValid: coverImageValid };
      });

      setMessage("Fill all fields");
      setIcon("close");
      setTimeout(() => {
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 500);
      }, 500);
      return;
    }

    // save to context...
    AppCtx.manipulateBeforeAddingLocationData({
      fname: fname.value,
      lname: lname.value,
      brand: brand.value,
      idnumber: idnumber.value,
      ainayaid: ainayaid.value,
      profile: pickedImage.value,
      cover: coverImage.value,
      type: "New Profile",
    });

    setMessage("Okay");
    setIcon("check");
    setTimeout(() => {
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
        navigation.navigate("PickLocationScreen");
      }, 500);
    }, 500);
  }

  function coverHandler(image) {
    setCoverImage((prevState) => {
      return { ...prevState, value: image, isValid: true };
    });
  }

  return (
    <SafeAreaView style={[styles.container, { position: "relative" }]}>
      <View
        style={{
          flex: 1,
          height: 330,
          width: 330,
          alignSelf: "center",
          position: "absolute",
          top: "20%",
          zIndex: 100000000,
          display: showNeedPermission ? "flex" : "none",
        }}
      >
        <CustomizedLottieMessage
          messageHeader={"Notification permission"}
          subHeader={"You should open setting and allow notification"}
          buttonTitle={"Okay, I understand"}
          lottieFile={require("../../assets/LottieAnimations/81148-new-message-notification.json")}
          understandHandler={() => {
            setShowNeedPermission(false);
          }}
        />
      </View>
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
        style={[
          {
            flex: 1,
          },
          showNeedPermission ? { opacity: 0.2 } : { opacity: 1 },
        ]}
        pointerEvents={showNeedPermission || formSubmitLoader ? "none" : "auto"}
      >
        <Text style={styles.mainHeader}>Complete Profile.</Text>
        <ScrollView>
          <View>
            <Text style={styles.up}>Taarifa Binafsi.</Text>
            <TextInput
              mode="outlined"
              label="Jina la kwanza"
              value={fname.value}
              onChangeText={(text) =>
                setFname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={fname.isValid ? "grey" : "#EF233C"}
              outlineColor={fname.isValid ? "grey" : "#EF233C"}
            />
            <TextInput
              mode="outlined"
              label="Jina la ukoo"
              value={lname.value}
              onChangeText={(text) =>
                setLname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={lname.isValid ? "grey" : "#EF233C"}
              outlineColor={lname.isValid ? "grey" : "#EF233C"}
              style={styles.formInput}
            />
            <View style={styles.formInput}>
              {Platform.OS === "ios" ? (
                <>
                  <Pressable
                    onPress={() => {
                      if (toggleIdType === "none") {
                        setToggleIdType("flex");
                        setIdTypeIcon("chevron-up");
                        Keyboard.dismiss();
                      } else {
                        setToggleIdType("none");
                        setIdTypeIcon("chevron-down");
                      }
                    }}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        label="Chagua Aina ya kitambulisho"
                        textColor="black"
                        editable={false}
                        value={ainayaid.value}
                        mode="outlined"
                        style={[styles.formInput, { backgroundColor: "white" }]}
                        right={<TextInput.Icon icon={idTypeIcon} />}
                      />
                    </View>
                  </Pressable>
                  <Picker
                    mode="dropdown"
                    selectedValue={ainayaid.value}
                    onValueChange={(text) =>
                      setAinayaid((prevState) => {
                        return {
                          ...prevState,
                          value: text,
                          isValid: true,
                        };
                      })
                    }
                    style={[styles.pickerStyling, { display: toggleIdType }]}
                  >
                    <Picker.Item label="NIDA" value="NIDA" />
                    <Picker.Item label="LESENI" value="LESENI" />
                    <Picker.Item label="PASSPORT" value="PASSPORT" />
                  </Picker>
                </>
              ) : (
                <>
                  <View style={{ marginTop: "2%" }}>
                    <Text style={{ marginLeft: "3%" }}>
                      Chagua Aina ya Kitambulisho
                    </Text>
                    <View
                      style={{
                        borderColor: "grey",
                        backgroundColor: COLORS.primary,
                        borderRadius: 5,
                        borderWidth: 1,
                      }}
                    >
                      <Picker
                        mode="dropdown"
                        style={{
                          backgroundColor: "white",
                        }}
                        selectedValue={ainayaid.value}
                        onValueChange={(text) =>
                          setAinayaid((prevState) => {
                            return {
                              ...prevState,
                              value: text,
                              isValid: true,
                            };
                          })
                        }
                      >
                        <Picker.Item label="NIDA" value="NIDA" />
                        <Picker.Item label="LESENI" value="LESENI" />
                        <Picker.Item label="PASSPORT" value="PASSPORT" />
                      </Picker>
                    </View>
                  </View>
                </>
              )}
            </View>
            <TextInput
              mode="outlined"
              label="Namba ya kitambulisho"
              value={idnumber.value}
              keyboardType="numeric"
              maxLength={20}
              onChangeText={(text) =>
                setIdnumber((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={idnumber.isValid ? "grey" : "#EF233C"}
              outlineColor={idnumber.isValid ? "grey" : "#EF233C"}
              style={styles.formInput}
            />
            <TextInput
              mode="outlined"
              label="Jina la Biashara (Brand)"
              value={brand.value}
              maxLength={20}
              onChangeText={(text) =>
                setBrand((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={brand.isValid ? "grey" : "#EF233C"}
              outlineColor={brand.isValid ? "grey" : "#EF233C"}
              style={styles.formInput}
            />

            <Text style={[styles.up, { marginTop: 12 }]}>Picha ya wasifu.</Text>

            <Text
              style={{
                fontFamily: "montserrat-17",
                fontSize: 12,
                color: COLORS.secondary,
              }}
            >
              ** Picha ya profaili, inaokena kwa wateja.
            </Text>
            <ImagePicker
              fileHandler={profileHandler}
              isValid={pickedImage.isValid}
            />
            <Text style={[styles.up, { marginTop: 10 }]}>
              Picha ya biashara.
            </Text>
            <Text
              style={{
                fontFamily: "montserrat-17",
                fontSize: 12,
                color: COLORS.secondary,
              }}
            >
              ** Picha ya kujitangaza(promo), inaokena kwa wateja.
            </Text>
            <CoverPhoto
              fileHandler={coverHandler}
              isValid={coverImage.isValid}
            />

            <Button
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                marginTop: 10,
                backgroundColor: COLORS.secondary,
              }}
              mode="contained"
              onPress={saveMetadatahHandler}
            >
              Wasilisha
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default memo(CompleteProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
  mainHeader: {
    fontSize: 30,
    fontFamily: "montserrat-17",
    marginVertical: 10,
    color: COLORS.secondary,
  },
  formInput: {
    marginTop: 6,
  },
  up: {
    fontFamily: "montserrat-14",
    fontSize: 20,
    marginTop: 6,
    marginBottom: 0,
    color: "grey",
  },
  map: {
    flex: 1,
  },
});
