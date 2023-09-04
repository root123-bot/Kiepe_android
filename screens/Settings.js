/* eslint-disable react-native/no-inline-styles */
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext, memo } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import TransparentBackgroundButton from "../components/UI/TransparentBackButton";
import KibandaPanel from "../components/UI/KibandaPanel";
import { Asset } from "expo-asset";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { AppContext } from "../store/context";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { _cacheResourcesAsync } from "../utils";
import Background from "../components/UI/Background";
import { CustomizedLottieMessage, CustomizedLottieMessage2 } from "../components/UI/Message";
import { Modal } from "react-native-paper";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import * as ImageCache from "react-native-expo-image-cache";
import { BASE_URL } from "../constants/domain";
import { executeUserMetadata, updateUserProfilePicture } from "../utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SettingScreen({ navigation }) {
  const AppCtx = useContext(AppContext);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showNeedPermission, setShowNeedPermission] = useState(false);
  const [displayDialogue, setDisplayDialogue] = useState(false);
  const [imageTakeLoading, setImageTakeLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [displayYouAboutToSwitchFromCustomerToKibanda, setDisplayYouAboutToSwitchFromCustomerToKibanda] = useState(false)
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to use this feature",
        [{ text: "Okay" }]
      );
      return false;
    }

    return true;
  }


  // YOU CAN REMOVE THIS LOGIC IF IT DOES NOT MAKE SENSE, IN SOME CASES THE USER_ IS NOT REGISTERED, AT LEAST WE SHOULD CALL THIS IS WE DETECT THERE IS STORED "user_id" IN THE DEVICE STORAGE
  const checkValidityOfUserIfExisted = async () => {
    try {
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


  const openCameraHandler = async () => {
    try {
      setImageTakeLoading(true);

      if (Platform.OS === "ios") {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          setImageTakeLoading(false);
          return;
        }
      }
      const image = await launchCameraAsync({});
      if (!image.canceled) {
        setCapturedImage(image);
        setPreviewImage({ data: image.assets[0].uri, state: "taken" });

        const formData = new FormData();

        formData.append("user_id", AppCtx.usermetadata.get_user_id);
        // profile_picture_append
        let uri_splited = image.assets[0].uri.split(".");
        let file_type = uri_splited[uri_splited.length - 1];
        if (Platform.OS === "ios") {
          formData.append("photo", {
            uri: image.assets[0].uri,
            name: image.assets[0].fileName
              ? image.assets[0].fileName
              : "new_file." + file_type,
            type: image.assets[0].type,
          });
        } else if (Platform.OS === "android") {
          let uri = image.assets[0].uri;
          if (uri[0] === "/") {
            uri = `file://${image.assets[0].uri}`;
            uri = uri.replace(/%/g, "%25");
          }
          formData.append("photo", {
            uri: uri,
            name: "photo." + file_type,
            type: `image/${file_type}`,
          });
        }

        updateUserProfilePicture(formData, {
          "Content-Type": "multipart/form-data",
        });
        setDisplayDialogue(false);
      }
      setImageTakeLoading(false);
    } catch (err) {
      // alert("Error ", err.message)
      setImageTakeLoading(false);
    }
  };

  const openLibraryHandler = async () => {
    try {
      setImageTakeLoading(true);
      const captured = await launchImageLibraryAsync({
        quality: 0.2,
      });

      if (!captured.canceled) {
        setCapturedImage(captured);
        setPreviewImage({ data: captured.assets[0].uri, state: "taken" });
        const formData = new FormData();

        formData.append("user_id", AppCtx.usermetadata.get_user_id);
        // profile_picture_append
        let uri_splited = captured.assets[0].uri.split(".");
        let file_type = uri_splited[uri_splited.length - 1];
        if (Platform.OS === "ios") {
          formData.append("photo", {
            uri: captured.assets[0].uri,
            name: captured.assets[0].fileName
              ? captured.assets[0].fileName
              : "new_file." + file_type,
            type: captured.assets[0].type,
          });
        } else if (Platform.OS === "android") {
          let uri = captured.assets[0].uri;
          if (uri[0] === "/") {
            uri = `file://${captured.assets[0].uri}`;
            uri = uri.replace(/%/g, "%25");
          }
          formData.append("photo", {
            uri: uri,
            name: "photo." + file_type,
            type: `image/${file_type}`,
          });
        }

        updateUserProfilePicture(formData, {
          "Content-Type": "multipart/form-data",
        });
        setDisplayDialogue(false);
      }
      setImageTakeLoading(false);
    } catch (err) {
      // alert("Error: ", err.message);
      setImageTakeLoading(false);
    }
  };
  if (AppCtx.stillExecutingUserMetadata) {
  
    return <LoadingSpinner />;
  }

  if (AppCtx.isAunthenticated) {
    return (
      <View style={{
        flex: 1, 
        position: "relative"
      }}>
        <StatusBar style="dark" />
        <Modal
          visible={displayDialogue}
          onDismiss={() => {
            setDisplayDialogue(false);
          }}
          contentContainerStyle={{
            width: "90%",
            minHeight: 200,
            backgroundColor: "white",
            borderRadius: 10,
            alignSelf: "center",
            position: "absolute",
            top: "30%",
          }}
        >
          <View
            style={{
              width: "90%",
              borderRadius: 10,
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "grey",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "48%",
                  // height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={openLibraryHandler}>
                  <Image
                    source={require("../assets/images/attachment.png")}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      // color: "#55A630",
                      fontFamily: "montserrat-17",
                      color: "white",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    Choose Image
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "48%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={openCameraHandler}>
                  <Image
                    source={require("../assets/images/photo.png")}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      // color: "#55A630",
                      fontFamily: "montserrat-17",
                      color: "white",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    Open Camera
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={[
            { flex: 1 },
            displayDialogue ? { opacity: 0.05 } : { opacity: 1 },
          ]}
          pointerEvents={displayDialogue ? "none" : "auto"}
        >
          <ImageBackground
            style={styles.imgBack}
            source={require("../assets/images/background/2.jpg")}
          >
            <View
              style={{
                flex: 1,
                height: 330,
                display: showNeedPermission ? "flex" : "none",
                width: 330,
                alignSelf: "center",
                position: "absolute",
                top: "20%",
                zIndex: 100000000,
              }}
            >
              <CustomizedLottieMessage
                messageHeader={"Notification Permission"}
                subHeader={"Open setting and allow notification permission"}
                buttonTitle={"Okay, I understand"}
                lottieFile={require("../assets/LottieAnimations/81148-new-message-notification.json")}
                understandHandler={() => {
                  setShowNeedPermission(false);
                }}
              />
            </View>
            
            {/* this show you about to switch account to kibanda from customer */}
            <View
              style={{
                flex: 1,
                display: displayYouAboutToSwitchFromCustomerToKibanda ? "flex" :  "none",
                height: 330,
                width: 330,
                alignSelf: "center",
                position: "absolute",
                top: "20%",
                zIndex: 100000000,
              }}
            >
              <CustomizedLottieMessage2
                messageHeader={"Switching Account"}
                subHeader={"Your about to switch to Restaurant account type"}
                buttonTitle={"Cancel"}
                buttonTitle2={"Switch"}
                cancelHandler={() => setDisplayYouAboutToSwitchFromCustomerToKibanda(false)}
                lottieFile={require("../assets/LottieAnimations/animation_ll6d92hq.json")}
                understandHandler={() => {
                  setDisplayYouAboutToSwitchFromCustomerToKibanda(false)
                }}
                understandHandler2={() => {
                  setDisplayYouAboutToSwitchFromCustomerToKibanda(false)
                  navigation.navigate("CompleteKibandaProfile")
                }}
              />
            
            </View>
            <SafeAreaView style={styles.parentContainer}>
              <ScrollView
                style={[
                  styles.childContainer,
                  showNeedPermission && {
                    opacity: 0.3,
                  },
                ]}
                pointerEvents={showNeedPermission || displayYouAboutToSwitchFromCustomerToKibanda ? "none" : "auto"}
              >
                <TouchableOpacity
                  onPress={() => {
                    setDisplayDialogue(true);
                  }}
                >
                  <View style={styles.innerContainer}>
                    <View
                      style={[
                        styles.iconHolder,
                        AppCtx.usermetadata.get_image && {
                          backgroundColor: "transparent",
                        },
                      ]}
                    >
                      {previewImage ? (
                        <Image
                          source={{ uri: previewImage.data }}
                          style={[
                            styles.iconimg,
                            AppCtx.usermetadata.get_image && {
                              width: "100%",
                              height: "100%",
                              borderRadius: 190 / 2,
                            },
                          ]}
                        />
                      ) : AppCtx.usermetadata.get_image ? (
                        <ImageCache.Image
                          tint="light"
                          transitionDuration={300}
                          style={[
                            styles.iconimg,
                            AppCtx.usermetadata.get_image && {
                              width: "100%",
                              height: "100%",
                              borderRadius: 190 / 2,
                            },
                          ]}
                          {...{
                            preview: {
                              uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
                            },
                            uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
                          }}
                        />
                      ) : (
                        <>
                          <Image
                            source={require("../assets/images/wide.png")}
                            style={{
                              width: "80%",
                              height: "80%",
                            }}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.nameContainer}>
                  {/* this name should be displayed only for the kibanda for customer just number only */}
                  {/* idea yangu "Hi, Karibu" itakuwa displayed only to custumer, Kibanda ataona jina lake hapa.. */}

                  {/* <Text style={styles.name}>Habari, Karibu</Text> */}
                  <Text style={styles.phone}>
                    {/* hii inachelewa ku-fetch... sometimes inaleta error .phone_number not found.. */}
                    {AppCtx.usermetadata.phone_number}
                    {/* +225623317196 */}
                  </Text>
                </View>
                <View style={styles.footer}>
                  <TransparentBackgroundButton />
                  <KibandaPanel
                    showMessageHandler={(status) => {
                      setShowNeedPermission(status);
                    }}
                    showSwitchAccountMessage={(flag) => {
                      console.log("The flag i have ", flag)
                      setDisplayYouAboutToSwitchFromCustomerToKibanda(flag)
                    }}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </View>
    );
  } else {
    return (
      <>
        <Background>
          <View style={styles.authContainer}>
            <View style={styles.authInnerContainer}>
              <Text style={styles.authText}>
                This feature is only available for registered users.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 12,
                }}
              >
                <Button
                  mode="contained"
                  labelStyle={{
                    fontFamily: "montserrat-17",
                  }}
                  style={{
                    width: "48%",
                    backgroundColor: "grey",
                  }}
                  onPress={() =>
                    navigation.navigate("Register", {
                      ugroup: undefined,
                    })
                  }
                >
                  Register
                </Button>
                <Button
                  mode="contained"
                  labelStyle={{
                    fontFamily: "montserrat-17",
                  }}
                  style={{ width: "48%", backgroundColor: "grey" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Button>
              </View>
            </View>
          </View>
        </Background>
      </>
    );
  }
}

export default memo(SettingScreen);

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: "row",
  },
  loginText: {
    color: COLORS.primary,
  },
  registerText: {
    color: COLORS.primary,
  },
  authText: {
    fontFamily: "montserrat-17",
    color: COLORS.primary,
    marginVertical: 10,
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
  },
  authInnerContainer: {
    backgroundColor: COLORS.secondary,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  imgStyle: {
    opacity: 0.5,
  },
  parentContainer: {
    flex: 1,
    marginTop: 60,
  },
  childContainer: {
    flex: 1,
  },
  innerContainer: {
    marginTop: 14,
    alignItems: "center",
  },
  iconHolder: {
    width: 190,
    height: 190,
    borderRadius: 190 / 2, // kwenye android borderRadius kwa % inasumbua...ili upate round chukua width ya image / 2 instead ya kutumia %
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconimg: {
    width: 90,
    height: 90,
  },
  nameContainer: {
    backgroundColor: "black",
    marginTop: 5,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    opacity: 0.7,
    paddingVertical: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "montserrat-17",
    textTransform: "capitalize",
    color: "white",
  },
  phone: {
    fontSize: 15,
    fontFamily: "montserrat-17",
    textTransform: "capitalize",
    color: "white",
  },
  footer: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 21,
  },
});
