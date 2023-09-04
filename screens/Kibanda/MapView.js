/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState, useRef, useContext } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import MapSearchBar from "../../components/UI/MapSearchBar";
import {
  LottieMessage,
  TransparentPopUpIconMessage,
} from "../../components/UI/Message";
import { AppContext } from "../../store/context";
import { Button } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import {
  completeKibandaProfile,
  editKibandaProfile,
} from "../../utils/requests";
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken("sk.eyJ1IjoibXdldWM2NTQiLCJhIjoiY2xrdGY1bHM2MDQyMzNwbzlyc3F5cmh6MSJ9.J9jFoCswSzdsHf6xyY7B8Q")

// unable to update mapView issue https://github.com/react-native-maps/react-native-maps/issues/1482
const MapViewScreen = ({ navigation }) => {
  const AppCtx = useContext(AppContext);
  const mapRef = useRef();
  const searchSpinnerRef = useRef();

  const [location, setLocation] = useState(null);
  const [zoom, setZoom] = useState(15)
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const [showAnimationUltimate, setShowAnimationUltimate] = useState(false);
  const [formSubmitLoaderUltimate, setFormSubmitLoaderUltimate] =
    useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const [changeCountLocation, setChangeCountLocation] = useState(0);
  // const [forceRefresh, setForceRefresh] = useState();
  const [pinnedLocation, setPinnedLocation] = useState();

  useEffect(() => {
    // ka-create arrow function on the fly then akai-fungia kwenye mabano () ili aweze kui-call, i love it

    if (AppCtx.initialCoords) {
      setLocation([parseFloat(AppCtx.initialCoords[1]), parseFloat(AppCtx.initialCoords[0])]);
      setChangeCountLocation((prevState) => prevState + 1);
      return;
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let captured = await Location.getCurrentPositionAsync({});
      const coords = [parseFloat(captured.coords.longitude), parseFloat(captured.coords.latitude)];
      setLocation(coords);
      setChangeCountLocation((prevState) => prevState + 1);
    })();
  }, []);

  async function searchQueryHandler(query) {
    Keyboard.dismiss();
    if (query.trim().length < 1) {
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    const computedQueryCoords = await Location.geocodeAsync(query);

    if (computedQueryCoords.length > 0) {
      const coords = [
        parseFloat(computedQueryCoords[0].longitude),
        parseFloat(computedQueryCoords[0].latitude)
      ];
      setLocation(coords);
      setZoom(14)
      setChangeCountLocation((prevState) => prevState + 1);
    }
    setShowAnimation(false);
    setTimeout(() => {
      setFormSubmitLoader(false);
    }, 1000);
  }

  async function updateProfileHandler() {
    // we need to edit the profile
    Keyboard.dismiss();
    setFormSubmitLoaderUltimate(true);
    setShowAnimationUltimate(true);
    const existingMetadata = AppCtx.beforeAddLocationData;

    const formUpload = new FormData();

    formUpload.append("user_id", AppCtx.usermetadata.get_user_id);
    formUpload.append("fname", existingMetadata.fname);
    formUpload.append("lname", existingMetadata.lname);
    formUpload.append("brand", existingMetadata.brand);
    formUpload.append("coords", pinnedLocation ? [pinnedLocation[1], pinnedLocation[0]] : [location[1], location[0]]);
    formUpload.append("phone", existingMetadata.phone);


    // optional
    if (existingMetadata.cover) {
      // cover picture append
      let uri_splited =
        existingMetadata.cover.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formUpload.append("cover", {
          uri: existingMetadata.cover.assets[0].uri,
          name: existingMetadata.cover.assets[0].fileName
            ? existingMetadata.cover.assets[0].fileName
            : "new_file." + file_type,
          type: existingMetadata.cover.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = existingMetadata.cover.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${existingMetadata.cover.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formUpload.append("cover", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }
    }

    // optional
    if (existingMetadata.profile) {
      let uri_splited =
        existingMetadata.profile.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formUpload.append("profile", {
          uri: existingMetadata.profile.assets[0].uri,
          name: existingMetadata.profile.assets[0].fileName
            ? existingMetadata.profile.assets[0].fileName
            : "new_file." + file_type,
          type: existingMetadata.profile.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = existingMetadata.profile.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${existingMetadata.profile.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formUpload.append("profile", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }
    }

    // we appended all of required data even the phone number
    try {
      const result = await editKibandaProfile(formUpload, {
        "Content-Type": "multipart/form-data",
      });
      AppCtx.manipulateUserMetadata(result);

      setIcon("check");
      setMessage("Profile Saved");
      setShowAnimationUltimate(false);
      // Restaurant is our target to navigate but it does not refresh itself
      // to render the new changes even if we updated the "context"
      // so here for now lets redirect to settings but also we should instead
      // use cached images for the "banner" instead of background image
      setTimeout(() => {
        setFormSubmitLoaderUltimate(false);
        navigation.navigate("Restaurant");
      }, 1000);
    } catch (err) {
      setIcon("close");
      setMessage("Imefeli");
      setShowAnimationUltimate(false);
      setTimeout(() => {
        setFormSubmitLoaderUltimate(false);
      }, 1000);
    }
  }

  function completeProfileHandler() {
    Keyboard.dismiss();

    const formUpload = new FormData();
    const existingMetadata = AppCtx.beforeAddLocationData;

    // endapo mtu yupo fasta nahisi data za mwisho zitakuwa bado hazija-update context... but this scenario is 0.0000001% might happen
    if (existingMetadata.cover) {
      setFormSubmitLoaderUltimate(true);
      setShowAnimationUltimate(true);
      formUpload.append("user_id", AppCtx.usermetadata.get_user_id);
      formUpload.append("fname", existingMetadata.fname);
      formUpload.append("lname", existingMetadata.lname);
      formUpload.append("brand", existingMetadata.brand);
      formUpload.append("idnumber", existingMetadata.idnumber);
      formUpload.append("idtype", existingMetadata.ainayaid);
      formUpload.append("coords", pinnedLocation ? [pinnedLocation[1], pinnedLocation[0]] : [location[1], location[0]]);

      // profile picture append
      let uri_splited = existingMetadata.profile.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formUpload.append("profile", {
          uri: existingMetadata.profile.assets[0].uri,
          name: existingMetadata.profile.assets[0].fileName
            ? existingMetadata.profile.assets[0].fileName
            : "new_file." + file_type,
          type: existingMetadata.profile.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = existingMetadata.profile.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${existingMetadata.profile.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formUpload.append("profile", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }

      // cover picture append
      uri_splited = existingMetadata.cover.assets[0].uri.split(".");
      file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formUpload.append("cover", {
          uri: existingMetadata.cover.assets[0].uri,
          name: existingMetadata.cover.assets[0].fileName
            ? existingMetadata.cover.assets[0].fileName
            : "new_file." + file_type,
          type: existingMetadata.cover.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = existingMetadata.cover.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${existingMetadata.cover.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formUpload.append("cover", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }

      completeKibandaProfile(formUpload, {
        "Content-Type": "multipart/form-data",
      })
        .then((result) => {
          // what i return is kibanda profile
          AppCtx.manipulateUserMetadata(result);
          // i know at this state the user is will be waiting for
          // admin verification so redirect to the WaitingVerification..
          setIcon("check");
          setMessage("Profile Saved");
          setShowAnimationUltimate(false);
          setTimeout(() => {
            setFormSubmitLoaderUltimate(false);
            navigation.navigate("WaitingVerification");
          }, 1000);
        })
        .catch((err) => {
          setIcon("close");
          setMessage("Imefeli");
          setShowAnimationUltimate(false);
          setTimeout(() => {
            setFormSubmitLoaderUltimate(false);
          }, 1000);
        });
    } else {
      alert("You so fast dog, context is not yet updated");
    }
  }

  if (!location) {
    return <LoadingSpinner />;
  }

  // kwa nini in android display: absolute make view disappear while in ios it works fine?? https://stackoverflow.com/questions/49051707/react-native-view-disappears-when-position-is-absolute-on-android
  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        {changeCountLocation === 1 && (
          <View
            style={{
              flex: 1,
              height: 380,
              width: 330,
              alignSelf: "center",
              position: "absolute",
              top: "30%",
              zIndex: 100000000,
            }}
          >
            <LottieMessage
              understandHandler={() => {
                setChangeCountLocation((prevState) => prevState + 1);
              }}
              useCurrentLocationHandler={async () => {
                // we have initial coords in App "location"
                setChangeCountLocation((prevState) => prevState + 1);
                // coords are submitted as "string" of lat, long
                // lets submit all things...

                const existingMetadata = AppCtx.beforeAddLocationData;

                if (existingMetadata.type === "New Profile") {
                  // new profile is added
                  // can we call completeProfileHandler
                  // first set pinned location as the
                  // but i think format of data to be submitted
                  // it should be string we have location in
                  // array.. but here i see everytime we submit
                  // location in array
                  // setPinnedLocation();
                  completeProfileHandler();
                } else if (existingMetadata.type === "Edit Profile") {
                  // we need to edit the profile
                  Keyboard.dismiss();
                  setFormSubmitLoaderUltimate(true);
                  setShowAnimationUltimate(true);

                  const formUpload = new FormData();

                  formUpload.append("user_id", AppCtx.usermetadata.get_user_id);
                  formUpload.append("fname", existingMetadata.fname);
                  formUpload.append("lname", existingMetadata.lname);
                  formUpload.append("brand", existingMetadata.brand);
                  formUpload.append("coords", pinnedLocation ? [pinnedLocation[1], pinnedLocation[0]] : [location[1], location[0]]);
                  formUpload.append("phone", existingMetadata.phone);

                  // optional
                  if (existingMetadata.cover) {
                    // cover picture append
                    let uri_splited =
                      existingMetadata.cover.assets[0].uri.split(".");
                    let file_type = uri_splited[uri_splited.length - 1];
                    if (Platform.OS === "ios") {
                      formUpload.append("cover", {
                        uri: existingMetadata.cover.assets[0].uri,
                        name: existingMetadata.cover.assets[0].fileName
                          ? existingMetadata.cover.assets[0].fileName
                          : "new_file." + file_type,
                        type: existingMetadata.cover.assets[0].type,
                      });
                    } else if (Platform.OS === "android") {
                      let uri = existingMetadata.cover.assets[0].uri;
                      if (uri[0] === "/") {
                        uri = `file://${existingMetadata.cover.assets[0].uri}`;
                        uri = uri.replace(/%/g, "%25");
                      }
                      formUpload.append("cover", {
                        uri: uri,
                        name: "photo." + file_type,
                        type: `image/${file_type}`,
                      });
                    }
                  }

                  // optional
                  if (existingMetadata.profile) {
                    let uri_splited =
                      existingMetadata.profile.assets[0].uri.split(".");
                    let file_type = uri_splited[uri_splited.length - 1];
                    if (Platform.OS === "ios") {
                      formUpload.append("profile", {
                        uri: existingMetadata.profile.assets[0].uri,
                        name: existingMetadata.profile.assets[0].fileName
                          ? existingMetadata.profile.assets[0].fileName
                          : "new_file." + file_type,
                        type: existingMetadata.profile.assets[0].type,
                      });
                    } else if (Platform.OS === "android") {
                      let uri = existingMetadata.profile.assets[0].uri;
                      if (uri[0] === "/") {
                        uri = `file://${existingMetadata.profile.assets[0].uri}`;
                        uri = uri.replace(/%/g, "%25");
                      }
                      formUpload.append("profile", {
                        uri: uri,
                        name: "photo." + file_type,
                        type: `image/${file_type}`,
                      });
                    }
                  }

                  // we appended all of required data even the phone number
                  try {
                    const result = await editKibandaProfile(formUpload, {
                      "Content-Type": "multipart/form-data",
                    });
                    AppCtx.manipulateUserMetadata(result);

                    setIcon("check");
                    setMessage("Profile Saved");
                    setShowAnimationUltimate(false);
                    // Restaurant is our target to navigate but it does not refresh itself
                    // to render the new changes even if we updated the "context"
                    // so here for now lets redirect to settings but also we should instead
                    // use cached images for the "banner" instead of background image
                    setTimeout(() => {
                      setFormSubmitLoaderUltimate(false);
                      navigation.navigate("Restaurant");
                    }, 1000);
                  } catch (err) {
                    setIcon("close");
                    setMessage("Imefeli");
                    setShowAnimationUltimate(false);
                    setTimeout(() => {
                      setFormSubmitLoaderUltimate(false);
                    }, 1000);
                  }
                }
              }}
            />
          </View>
        )}

        {/* this makes the button of submit to occur, should i make it inactive it when someone 
        submit form, i think it will be fine.  */}
        <Animated.View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
          }}
          pointerEvents={
            changeCountLocation === 1 ||
            formSubmitLoader ||
            formSubmitLoaderUltimate
              ? "none"
              : "auto"
          }
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={{
            display: pinnedLocation ? "flex" : "none",
            position: "absolute",
            bottom: 20,
            right: 1,
            width: "100%",
            height: 50,
            zIndex: 10,
          }}
        >
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
            }}
            icon="hand-okay"
            loading={formSubmitLoaderUltimate}
            mode="contained"
            onPress={AppCtx.beforeAddLocationData.type === "New Profile" ? completeProfileHandler : updateProfileHandler}
            style={{
              width: "95%",
              borderRadius: 10,
              alignSelf: "center",
              marginBottom: 10,
            }}
          >
            Submit Location
          </Button>
        </Animated.View>

        {/* hii inatumika ku-show animation when user search location in search bar */}
        <View
          ref={searchSpinnerRef}
          style={{
            flex: 1,
            display: formSubmitLoader ? "flex" : "none",
            height: 150,
            width: 150,
            alignSelf: "center",
            position: "absolute",
            top: "40%",
            zIndex: 100,
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader="Imemaliza"
            icon="check"
            inProcess={showAnimation}
          />
        </View>

        {/* when user submit the location and other metadata just show this loader */}
        <View
          style={{
            flex: 1,
            height: 150,
            display: formSubmitLoaderUltimate ? "flex" : "none",
            width: 150,
            alignSelf: "center",
            position: "absolute",
            top: "40%",
            zIndex: 100000000,
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader={message}
            icon={icon}
            inProcess={showAnimationUltimate}
          />
        </View>

        <View
          pointerEvents={
            changeCountLocation === 1 ||
            formSubmitLoader ||
            formSubmitLoaderUltimate
              ? "none"
              : "auto"
          }
          style={{
            zIndex: -1,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 40,
              width: "94%",
              alignSelf: "center",
              zIndex: 999,
            }}
          >
            <MapSearchBar
              searchQueryHandler={searchQueryHandler}
              isLoading={formSubmitLoader}
            />
          </View>
          <MapboxGL.MapView
            onPress={(e) => {
              setPinnedLocation(e.geometry.coordinates.reverse());
              // lets set the location to pinned location..
              // we'll remove it if it does not work but i think 
              // setLocation(e.geometry.coordinates)
            }}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(location[0]),
              longitude: parseFloat(location[1]),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <MapboxGL.Camera
              zoomLevel={zoom}
              centerCoordinate={location}
            />
            {pinnedLocation && (
              <MapboxGL.PointAnnotation
              key={0}
              id={`${Math.random()}`}
              coordinate={pinnedLocation.reverse()}
            /> 
              // <Marker coordinate={pinnedLocation && pinnedLocation} />
            )}
          </MapboxGL.MapView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default memo(MapViewScreen);
