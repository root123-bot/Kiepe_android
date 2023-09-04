/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */

// HII APP COZ INA JIRE-RENDER MARA NNE NDO MAANA INA-ASK FOR PERMISSIONS MARA NNE MFULULIZO... HII INA-BIDI TU-FIX ISITOKEE IN PRODUCTION
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, memo } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import KibandaCard from "../components/UI/Card";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import SearchComponent from "../components/UI/SearchBar";
import { COLORS } from "../constants/colors";
import { BASE_URL } from "../constants/domain";
import { getAvailableVibanda } from "../utils/requests";
import { AppContext } from "../store/context";
import FavoriteContainer from "../components/UI/FavoriteContainer";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { TransparentPopUpIconMessage } from "../components/UI/Message";
import { getDistance, getPreciseDistance } from "geolib";
import * as Location from "expo-location";
import { Modal } from "react-native-paper";
import AllfootballCard from "../components/UI/AllfootballCard";

function HomeScreen({ navigation }) {
  const AppCtx = useContext(AppContext);
  const [vibanda, setVibanda] = useState([]);
  const [initialVibanda, setInitialVibanda] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [stillFetching, setStillFetching] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [needtoarrangebydistance, setNeedToArrangeByDistance] = useState(false);

  useEffect(() => {
    if (vibanda.length > 0) {
      if (needtoarrangebydistance && AppCtx.activeFilter === "Nearby" && Object.keys(vibanda[0]['data']).includes('distance')) {
        setVibanda((prevState) => {
          return prevState.sort((a, b) => {
            return (
              a.data.distance -
              b.data.distance
            );
          });
        });
      }
    }
  }, [needtoarrangebydistance, AppCtx.activeFilter, vibanda])

  const TIMEOUT_DURATION = 15000;

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", async (e) => {
    });

    return () => unsubscribe();
  }, [navigation]);

  const isFavoriteFoundInAvailableVibanda = () => {
    let isFound = false;
    AppCtx.availableVibanda.forEach((kibanda) => {
      for (let fav of AppCtx.favoriteVibanda) {
        if (+kibanda.data.get_user_id === +fav) {
          isFound = true;
          break;
        }
      }
    });
    return isFound;
  };

  // i can useCallBack here to memorize this complete function
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("You should allow location access to complete profile.");
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let timeout;
    return new Promise(async (resolve, reject) => {
      // this inside is another function, so its return type can't stop/be returned by parent function..
      // i think we should have the parent function which return promise otherwise we're screwed the 
      // inner function here can't affect return type of our parent function..
      timeout = setTimeout(() => {
        clearTimeout(timeout)
        reject(new Error('Location request timeout'))
      }, TIMEOUT_DURATION)

   
      try {
      
        let location = await Location.getCurrentPositionAsync({});
        clearTimeout(timeout)
        const coords = [location.coords.latitude, location.coords.longitude];
        setCoordinates(coords);
        resolve(coords);
      }
      catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    })
  };

  const fetchVibanda = async () => {
    setStillFetching(true);
    let vibanda = await getAvailableVibanda();
    vibanda = vibanda.filter(
      (kibanda) =>
        kibanda.is_kibanda_profile_active && kibanda.is_default_meal_added
    );
    const manipulatedVibanda = vibanda.map((kibanda) => {
      return {
        data: { ...kibanda },
        key: kibanda.id,
      };
    });
    setVibanda(manipulatedVibanda);
    AppCtx.manipulateAvailableVibanda(manipulatedVibanda);
    setStillFetching(false);
    setInitialVibanda(manipulatedVibanda);
  };

  const fetchVibanda1 = async () => {
    setIsLoading(true);
    try {
      let vibanda = await getAvailableVibanda();
      vibanda = vibanda.filter(
        (kibanda) =>
          kibanda.is_kibanda_profile_active && kibanda.is_default_meal_added
      );
      const manipulatedVibanda = vibanda.map((kibanda) => {
        return {
          data: { ...kibanda },
          key: kibanda.id,
        };
      });

      AppCtx.manipulateActiveFilter("All");
      AppCtx.manipulateAvailableVibanda(manipulatedVibanda);
      setVibanda(manipulatedVibanda);
    } catch (error) {
      alert("Failed, check your connection");
    }
    setIsLoading(false);
  };

  function searchHandler(enteredText) {
    const filteredVibanda = AppCtx.availableVibanda.filter((kibanda) => {
      return (
        kibanda.data.brand_name
          .toLowerCase()
          .includes(enteredText.toLowerCase()) ||
        kibanda.data.physical_address
          .toLowerCase()
          .includes(enteredText.toLowerCase())
      );
    });
    setVibanda(filteredVibanda);
  }

  useEffect(() => {
    fetchVibanda();
  }, []);

  if (AppCtx.showLoadingSpinner) {
    return <LoadingSpinner />;
  }

  if (stillFetching) {
    return <LoadingSpinner />;
  }

  // is flatlist update itself or executed everytime data amount?
  return (
    <>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
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

        <SafeAreaView
          pointerEvents={formSubmitLoader ? "none" : "auto"}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <SearchComponent searchQueryHandler={searchHandler} />
            {AppCtx.toggleFavorite && !isFavoriteFoundInAvailableVibanda() && (
              <View
                style={{
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "montserrat-17",
                    fontSize: 16,
                    color: COLORS.secondary,
                  }}
                >
                  You've zero favorite restaurants
                </Text>
              </View>
            )}
            {AppCtx.toggleFavorite &&
              isFavoriteFoundInAvailableVibanda() &&
              AppCtx.favoriteVibanda.length > 0 && <FavoriteContainer />}
            {vibanda.length === 0 ? (
              <View style={{ height: 50 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: "montserrat-17",
                    color: "grey",
                  }}
                >
                  No Kibanda found
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                  }}
                >
                  {/* if its active background color should be black while text and icons should be white */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        AppCtx.manipulateActiveFilter("All");
                        // then we'll use this filter..
                        setShowAnimation(true);
                        setFormSubmitLoader(true);
                        setMessage("Fetching");
                        setIcon("search");
                        // fetchVibanda();
                        setVibanda(initialVibanda);
                        setTimeout(() => {
                          setShowAnimation(false);
                          setFormSubmitLoader(false);
                          setMessage("");
                          setIcon("");
                        }, 1000);
                      }}
                      style={{
                        marginRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "grey",
                        borderWidth: 1,
                        padding: 6,
                        backgroundColor:
                          AppCtx.activeFilter.toLowerCase() ===
                          "All".toLowerCase()
                            ? "grey"
                            : "transparent",
                      }}
                    >
                      <Octicons
                        name={"dot-fill"}
                        size={14}
                        color={
                          AppCtx.activeFilter.toLowerCase() ===
                          "All".toLowerCase()
                            ? "white"
                            : "grey"
                        }
                      />
                      <Text
                        style={{
                          color:
                            AppCtx.activeFilter.toLowerCase() ===
                            "All".toLowerCase()
                              ? "white"
                              : "grey",
                          marginLeft: 4,
                          fontFamily: "montserrat-17",
                        }}
                      >
                        All
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        AppCtx.manipulateActiveFilter("Nearby");
                        // then we'll use this filter..
                        // check/ask the location permission if its granted
                        // then get coords if not then tell the user he should
                        // grant the permission..
                        try {
                          setShowAnimation(true);
                          setFormSubmitLoader(true);
                          let coords = []
                          try {
                            coords = await getUserLocation();
                          }
                          catch (error) {
                            setShowAnimation(false);
                            setMessage("Timeout error");
                            setIcon("error-outline");
                            setTimeout(() => {
                              setShowAnimation(false);
                              setTimeout(() => {
                                setFormSubmitLoader(false);
                              }, 1000)
                            }, 1000);
                            return;
                          }
              
                          if (coords) {
                            // we need to celebrate
                            // i don't use prevState, we should update from the initial data
                            setVibanda(() => {
                              return initialVibanda.map((mt) => ({
                                ...mt,
                                data: {
                                  ...mt[Object.keys(mt)[0]],
                                  distance: getPreciseDistance(
                                    {
                                      latitude: coords[0],
                                      longitude: coords[1],
                                    },
                                    {
                                      latitude:
                                        mt[
                                          Object.keys(mt)[0]
                                        ].coordinates.split(",")[0],
                                      longitude:
                                        mt[
                                          Object.keys(mt)[0]
                                        ].coordinates.split(",")[1],
                                    }
                                  ),
                                },
                              }));
                            });
                            // sort vibanda by distance
                            setNeedToArrangeByDistance(true)
                            // setVibanda((prevState) => {
                            //   return prevState.sort((a, b) => {
                            //     return (
                            //       a[Object.keys(a)[0]].distance -
                            //       b[Object.keys(b)[0]].distance
                            //     );
                            //   });
                            // });

                            setShowAnimation(false);
                            setTimeout(() => {
                              setFormSubmitLoader(false);
                              setMessage("");
                              setIcon("");
                            }, 1000);
                          } else {
                            setShowAnimation(false);
                            setTimeout(() => {
                              setFormSubmitLoader(false);
                              setMessage("");
                              setIcon("");
                            }, 1000);
                            alert(
                              "Failed to get nearby due to lack of location permissions"
                            );
                          }
                        } catch (err) {
                          setShowAnimation(false);
                          setFormSubmitLoader(false);
                          alert(err.message);
                        }
                      }}
                      style={{
                        marginRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "grey",
                        borderWidth: 1,
                        padding: 6,
                        backgroundColor:
                          AppCtx.activeFilter.toLowerCase() ===
                          "Nearby".toLowerCase()
                            ? "grey"
                            : "transparent",
                      }}
                    >
                      <MaterialIcons
                        color={
                          AppCtx.activeFilter.toLowerCase() ===
                          "Nearby".toLowerCase()
                            ? "white"
                            : "grey"
                        }
                        name="near-me"
                        size={14}
                      />
                      <Text
                        style={{
                          color:
                            AppCtx.activeFilter.toLowerCase() ===
                            "Nearby".toLowerCase()
                              ? "white"
                              : "grey",
                          marginLeft: 4,
                          fontFamily: "montserrat-17",
                        }}
                      >
                        Nearby
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        AppCtx.manipulateActiveFilter("Highest rated");
                        // then we'll use this filter..
                        setShowAnimation(true);
                        setFormSubmitLoader(true);
                        setMessage("Fetching");
                        setIcon("search");

                        setVibanda(() => {
                          return initialVibanda.sort((a, b) => {
                            return (
                              b[Object.keys(b)[0]].average_ratings -
                              a[Object.keys(a)[0]].average_ratings
                            );
                          });
                        });

                        setTimeout(() => {
                          setShowAnimation(false);
                          setFormSubmitLoader(false);
                          setMessage("");
                          setIcon("");
                        }, 1000);
                      }}
                      style={{
                        marginRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "grey",
                        borderWidth: 1,
                        padding: 6,
                        backgroundColor:
                          AppCtx.activeFilter.toLowerCase() ===
                          "Highest rated".toLowerCase()
                            ? "grey"
                            : "transparent",
                      }}
                    >
                      <MaterialIcons
                        color={
                          AppCtx.activeFilter.toLowerCase() ===
                          "Highest rated".toLowerCase()
                            ? "white"
                            : "grey"
                        }
                        name="star"
                        size={14}
                      />

                      <Text
                        style={{
                          color:
                            AppCtx.activeFilter.toLowerCase() ===
                            "Highest rated".toLowerCase()
                              ? "white"
                              : "grey",
                          marginLeft: 4,
                          fontFamily: "montserrat-17",
                        }}
                      >
                        Highest rated
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        AppCtx.manipulateActiveFilter("Opened");
                        // then we'll use this filter..
                        setShowAnimation(true);
                        setFormSubmitLoader(true);
                        setMessage("Fetching");
                        setIcon("search");

                        // filter vibanda which only opened
                        const openedVibanda = initialVibanda.filter(
                          (metadata) => {
                            const mt = metadata[Object.keys(metadata)[0]];
                       
                            return mt.is_kibanda_opened === true;
                          }
                        );

                        setVibanda(openedVibanda);

                        setTimeout(() => {
                          setShowAnimation(false);
                          setFormSubmitLoader(false);
                          setMessage("");
                          setIcon("");
                        }, 1000);
                      }}
                      style={{
                        marginRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "grey",
                        borderWidth: 1,
                        padding: 6,
                        backgroundColor:
                          AppCtx.activeFilter.toLowerCase() ===
                          "Opened".toLowerCase()
                            ? "grey"
                            : "transparent",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="door-open"
                        size={14}
                        color={
                          AppCtx.activeFilter.toLowerCase() ===
                          "Opened".toLowerCase()
                            ? "white"
                            : "grey"
                        }
                      />
                      <Text
                        style={{
                          color:
                            AppCtx.activeFilter.toLowerCase() ===
                            "Opened".toLowerCase()
                              ? "white"
                              : "grey",
                          marginLeft: 4,
                          fontFamily: "montserrat-17",
                        }}
                      >
                        Opened
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
                <FlatList
                  style={styles.scrollView}
                  data={vibanda}
                  refreshing={isloading}
                  onRefresh={fetchVibanda1}
                  renderItem={(itemData) => {
                    return (
                      <>
                        <AllfootballCard
                          distance={
                            itemData.item.data.distance
                              ? +itemData.item.data.distance > 1000
                                ? `${(
                                    +itemData.item.data.distance / 1000
                                  ).toFixed(1)}KM`
                                : `${+itemData.item.data.distance}M`
                              : undefined
                          }
                          location={ itemData.item.data.physical_address.split(", ")[
                            itemData.item.data.physical_address.split(", ")
                              .length -
                              1 -
                              6
                          ] ? `${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                6
                            ]
                          }, ${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                5
                            ]
                          }` : itemData.item.data.physical_address.split(", ")[
                            itemData.item.data.physical_address.split(", ")
                              .length -
                              1 -
                              5
                          ] ? `${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                5
                            ]
                          }, ${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                4
                            ]
                          }` : itemData.item.data.physical_address.split(", ")[
                            itemData.item.data.physical_address.split(", ")
                              .length -
                              1 -
                              4
                          ] ? `${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                4
                            ]
                          }, ${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                3
                            ]
                          }` : `${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                3
                            ]
                          }, ${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                2
                            ]
                          }` }
                          rating={itemData.item.data.average_ratings}
                          isFavorite={AppCtx.favoriteVibanda.includes(
                            itemData.item.data.get_user_id
                          )}
                          userId={itemData.item.data.get_user_id}
                          restaurant={itemData.item.data}
                          image={`${BASE_URL}${itemData.item.data.get_cover_photo}`}
                          brand={itemData.item.data.brand_name}
                          opened={itemData.item.data.is_kibanda_opened}
                        />

                        {/* <KibandaCard
                          distance={
                            itemData.item.data.distance
                              ? +itemData.item.data.distance > 1000
                                ? `${(
                                    +itemData.item.data.distance / 1000
                                  ).toFixed(1)}KM`
                                : `${+itemData.item.data.distance}M`
                              : undefined
                          }
                          location={`${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                6
                            ]
                          }, ${
                            itemData.item.data.physical_address.split(", ")[
                              itemData.item.data.physical_address.split(", ")
                                .length -
                                1 -
                                5
                            ]
                          }`}
                          rating={itemData.item.data.average_ratings}
                          isFavorite={AppCtx.favoriteVibanda.includes(
                            itemData.item.data.get_user_id
                          )}
                          userId={itemData.item.data.get_user_id}
                          restaurant={itemData.item.data}
                          image={`${BASE_URL}${itemData.item.data.get_cover_photo}`}
                          brand={itemData.item.data.brand_name}
                          opened={itemData.item.data.is_kibanda_opened}
                        /> */}
                      </>
                    );
                  }}
                />
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 30,
    backgroundColor: COLORS.primary,
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 12,
  },
});
