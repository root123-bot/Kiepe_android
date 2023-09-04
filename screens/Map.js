/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback, useMemo, useRef, useContext, memo } from "react";
import { Keyboard, Text, Image, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
// import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import MapboxGL from "@react-native-mapbox-gl/maps";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import MapSearchBar from "../components/UI/MapSearchBar";
import {
  TransparentPopUpIconMessage,
} from "../components/UI/Message";
import { AppContext } from "../store/context";
import MapCallout from "../components/Map/MapCallout";
// import BottomSheet from "react-native-simple-bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet"
import * as ImageCache from "react-native-expo-image-cache";
import { BASE_URL } from "../constants/domain";
import { Rating } from "react-native-ratings";
import { Button } from "react-native-paper";
import * as Rneui from "@rneui/themed"
import { COLORS } from "../constants/colors";
import { getDistance, getPreciseDistance } from "geolib";
import { isUserExist } from "../utils/requests";

MapboxGL.setAccessToken("sk.eyJ1IjoibXdldWM2NTQiLCJhIjoiY2xrdGY1bHM2MDQyMzNwbzlyc3F5cmh6MSJ9.J9jFoCswSzdsHf6xyY7B8Q")
// unable to update mapView issue https://github.com/react-native-maps/react-native-maps/issues/1482


function MapScreen({ navigation }) { 
  const AppCtx = useContext(AppContext);
  const mapRef = useRef();
  const panelRef = useRef(null);
  const dWidth = Dimensions.get("window").width
  const higherSnapPoint = dWidth > 500 ? "31%" : "25%"
    // ref
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['1%', higherSnapPoint], []);
  
    // callbacks
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);

  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [location, setLocation] = useState([39.2803583, -6.8160837]);
  const [zoom, setZoom] = useState(11)
  const [loading, setLoading] = useState(false)
  const [changeCountLocation, setChangeCountLocation] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [distance, setDistance] = useState()
  const [displayCalculateDistanceSpinner, setDisplayCalculateDistanceSpinner] = useState(false)
  const calculateDistance = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("You should allow location access to calculate distance.");
      return;
    }
    setDisplayCalculateDistanceSpinner(true)
    let location = await Location.getCurrentPositionAsync({});
    const coords = [location.coords.latitude, location.coords.longitude];
    // if we have the coordinates lets calculate distance from that are to kibanda
    const distance = getPreciseDistance({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }, {
      latitude: selectedMarker.coordinates.split(",")[0],
      longitude: selectedMarker.coordinates.split(",")[1]
    })

    setDistance(distance)

    setDisplayCalculateDistanceSpinner(false)
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const handleMarkerPress = marker => {
    setSelectedMarker(marker)
    // panelRef.current.togglePanel()
    setDistance()
    setDisplayCalculateDistanceSpinner(false)
    bottomSheetRef.current.snapToIndex(1)
  } 

  const handleMapPress = (event) => {
    // setSelectedMarker(null);
    // setDistance()
    // setDisplayCalculateDistanceSpinner(false)
    // bottomSheetRef.current.snapToIndex(0)
  }

  const handleCalloutPress = () => {
    
  }

  async function searchQueryHandler(query) {
    Keyboard.dismiss();
    if (query.trim().length < 1) {
      return;
    }
    try {
      setFormSubmitLoader(true);
      setShowAnimation(true);
      const computedQueryCoords = await Location.geocodeAsync(query);

      if (computedQueryCoords.length > 0) {
        const coords = [
          computedQueryCoords[0].longitude,
          computedQueryCoords[0].latitude
        ];
        // 
        setLocation(coords);
        setZoom(15)
        setChangeCountLocation((prevState) => prevState + 1);
      }
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
      }, 1000);
    } catch (error) {
      setShowAnimation(false);
      setFormSubmitLoader(false);
      alert(error.message);
    }
  }

  // kule kwenye build hii nime-icomment
  if (AppCtx.showLoadingSpinner) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={{ flex: 1, position: "relative" }}>
        {/* hii inatumika ku-show animation when user search location in search bar */}
        <View
          style={{
            flex: 1,
            display: formSubmitLoader ? "flex" : "none",
            height: 150,
            width: 150,
            alignSelf: "center",
            position: "absolute",
            top: "40%",
            zIndex: 100000000,
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader="Imemaliza"
            icon="check"
            inProcess={showAnimation}
          />
        </View>
        <View pointerEvents={formSubmitLoader ? "none" : "auto"}>
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
              title="Search location"
              searchQueryHandler={searchQueryHandler}
            />
          </View>
          {/* default is 14 */}
          <MapboxGL.MapView 
          onPress={handleMapPress}
          style={styles.map}
          >
           
            <MapboxGL.Camera
              zoomLevel={zoom}
              centerCoordinate={location} 
            />
            <MapboxGL.SymbolLayer id="markerSymbols" />
            {AppCtx.availableVibanda
              .map((item) => Object.values(item)[0])
              .map((kibanda, index) => (
                <MapboxGL.PointAnnotation
                  key={index}
                  id={`${+index * Math.random()}`}
                  anchor={{x: 1, y: 1}}
                  coordinate={[
                    parseFloat(kibanda.coordinates.split(",")[1]),
                    parseFloat(kibanda.coordinates.split(",")[0])
                  ]}
                  onSelected={() => handleMarkerPress(kibanda)}
                /> 
              ))}
            
          </MapboxGL.MapView>
          
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            {
              selectedMarker && (
            
            <View style={{
              margin: 10,
              width: "100%",
              height: "100%",
             }}>
              <View style={{
                width: "100%",
                height: "55%",
                flexDirection: "row"
              }}>
                <View style={{
                  height: "100%",
                  width: "80%",
                  flexDirection: "row",
                }}>
                  <ImageCache.Image
                    tint="light"
                    transitionDuration={300}
                    style={[{
                      height: "100%",
                      width: "45%",
                      borderRadius: 15
                    }]}
                    {...
                      {preview: {
                        uri: `${BASE_URL}${selectedMarker.get_cover_photo}`
                      }, 
                      uri: `${BASE_URL}${selectedMarker.get_cover_photo}` 
                    }}
                  />
                  <View style={{
                    marginLeft: 10,
                    marginTop: "2%"
                  }}>
                    <Text 
                    numberOfLines={1}
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 18,
                      textTransform: 'capitalize',
                      color: "grey"
                    }}>
                      {`${
                          selectedMarker.brand_name.toUpperCase().length > 14 ? selectedMarker.brand_name.toUpperCase().substring(0, 14 - 3) + "..." : selectedMarker.brand_name.toUpperCase()
                        }`}
                    </Text>
                    {selectedMarker.average_ratings && (
                      <View style={{
                        marginVertical: 5,
                        flexDirection: "row",
                        width: "100%"
                      }}>
                        <Rating
                          imageSize={15}
                          ratingCount={5}
                          startingValue={selectedMarker.average_ratings}
                          readonly
                        />
                      </View>
                    )}  
                    {distance && (
                      <Text
                        style={[
                          { marginTop: 3, color: COLORS.danger, fontFamily: "montserrat-17", textTransform: "capitalize", fontSize: 12 },
                        ]}
                      >
                        Distance: {distance > 1000 ? `${(
                          distance/1000
                        ).toFixed(1)}KM`
                      : `${distance}M`}
                      </Text>
                    )}            
                  </View>
                </View>
                <View style={{
                  width: "12%",
                  marginTop: "2%",
                  alignItems: "flex-end",
                  backgroudColor: "blue"
                }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25
                    }}
                    source={
                      selectedMarker.is_kibanda_opened
                        ? require("../assets/images/open.png")
                        : require("../assets/images/closed.png")
                    }
                  />
                </View>
              </View>
              <View style={{
                width: "93%",
                marginTop: "3%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Button 
                loading={loading}
                onPress={() => {
                  if (loading) {
                    return;
                  }
                  setLoading(true)
                  // AppCtx.manipulateShowLoadingSpinner(true);
                  // AppCtx.manipulateShowLoadingSpinner2(false);

                  isUserExist(selectedMarker.phone_number).then(data => {
                    if (data.message === "User exist") {
                      setLoading(false)
                      AppCtx.manipulateClickedKibanda(selectedMarker.brand_name)
                      setTimeout(() => {
                        navigation.navigate("KibandaDetails2", {
                          restaurant: selectedMarker,
                        });
                      });
                    }
                    else {
                      setLoading(false)
                      alert("Sorry, restaurant has been deleted!")
                    }
                    
                  }).catch(err => {
                    setLoading(false)
                    console.log("something went wrong")
                    alert(err.message)
                  })
                  setLoading(false)

                }
                
                }
                mode="outlined" 
                style={{
                  backgroundColor: COLORS.secondary,
                  width: "80%", 
                  borderRadius: 10,
                  borderColor: "transparent",
                }}
                labelStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 16,
                  color: "white"
                }}>Visit</Button>
                <Rneui.Button loading={displayCalculateDistanceSpinner} onPress={() => calculateDistance()} type="solid" buttonStyle={{
                  borderRadius: 5
                }}>
                  <Rneui.Icon name="near-me" color="white" />
                </Rneui.Button>
                {/* <MaterialCommunityIcons name="map-marker-distance" size={24} color={COLORS.secondary} /> */}
              </View>
            </View>
              )}
          </BottomSheet>

          {/* <BottomSheet 
            onClose={() => handleMapPress}
            isOpen={selectedMarker ? true : false}
            ref={(ref) => (panelRef.current = ref)}
            sliderMaxHeight={Dimensions.get("window").height * 0.3}
            wrapperStyle={{
              height: "80%"
            }}
            sliderMinHeight={0}
          >
            <Text>Hello world!</Text>
          </BottomSheet> */}
          
          {/* my callout */}
          {/* {selectedMarker && (
            <MapboxGL.Callout
            anchor="top"
            style={{  
              width: 200,
              padding: 8,
              borderRadius: 8,
            }}>
              <TouchableOpacity onPress={() => console.log("pressed")}>
                <MapCallout kibanda={selectedMarker} />
              </TouchableOpacity>
            </MapboxGL.Callout>
          )} */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default memo(MapScreen);
