/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

// https://github.com/facebook/react-native/issues/19719 - this is the solution for the error (Dont use percentage for padding and margin in android) just read this guy suggestion
// tsirolnik commented Dec 25, 2019

import { StatusBar } from "expo-status-bar";
import React, {
  memo,
  useContext,
  useState,
  useRef,
  useEffect,
  useReducer,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Button, HelperText, List, TextInput } from "react-native-paper";
import KibandaCard from "../../components/UI/Card";
import KibandaCard1 from "../../components/UI/Card2";
import MenuItem from "../../components/UI/MenuItem";
import MenuItem2 from "../../components/UI/MenuItem2";
import { COLORS } from "../../constants/colors";
import { BASE_URL } from "../../constants/domain";
import { AppContext } from "../../store/context";
import {
  fetchKibandaReviews,
  isUserExist,
  KibandaTodayAvailableMenu,
  rateKibanda,
} from "../../utils/requests";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CustomizedLottieMessage2,
  TransparentPopUpIconMessage,
} from "../../components/UI/Message";
import { Modal } from "react-native-paper";
import { AirbnbRating, Rating } from "react-native-ratings";
import CustomLine from "../../components/UI/CustomLine";
import { TouchableOpacity } from "react-native";
import moment from "moment";

/* 

  I HAVE COMPLEX DATA WHICH MAKES MY UI WHEN UPDATING STH TO WAIT UNTIL THE COMPLEX DATA
  COMPLETE BEING EXECUTED? I TRIED EVERY SOLUTION BUT NONE HAVE WORKING I NOTICE THE PROBLEM
  IS WHEN I UPDATE/CHANGE THE COMPLEX STATE OF DATA.. SO WHAT'S THE SOLUTION IS USING THE 
  "useReducer" HOOK

  To help you separate the concerns (rendering and state management) React provides the hook
  useReducer(). The hook does so by extracting the state management out of the component.
  https://dmitripavlutin.com/react-usereducer/
  
  The useReducer() hook lets you separate the state management from the rendering logic of the component.
  (au hapa anachomaanisha ni kwamba state yetu target ambayo ni "quantity" ndo ina-separate hivyo na sio
  state ya price, au sio kama ndo hivi basi inabidi tu-handle "quantity" state in our component nahisi 
  hii inaweza ikasaidia ngoja tujaribu nahisi hizi quantity kama zikiwa zinakuwa updated huku inaweza 
  ikasaidia...  Hatuwezi tukaona hapa effect ya useReducer coz our target state is quantity which found in
  child component of MenuItem so no effect, i think we should manage all states of quantity, price, subtotal 
  of given menuItem inside this useReducer and then we'll see the outcome since it will update state of 
  quantity itself the starting point is to have initialState having all the menuItems with name default price,
  initialQuantity and so on... it will look like this ... 
      [{
        subtotal:___,
        quantity:___,
        menuItem:___,
        parentItem: ___,
        price: ___,
      }]

  then child menuITem  should refere its quantity, subtotal from this state and update it when user press
  increment or decrement button and then we'll see the outcome of useReducer hook..
  LETS START WITH THIS THEN WE CAN MOVE ON TO TOGGLEONOFF TO MAKE IT SMOOTH... AU NAHISI FOR NOW
  TUIACHE HIVIHIVI COZ TUNAENDA KWENYE PRESENTATION BUT NIKIMALIZA PRESENTATION HICHI KITU INABIDI NIKIFANYE 
  FOR NOW JUST DEAL WITH PAYMENTS COZ NDO KITU MUHIMU HICHO
      )
  
  Here i our case we have the complex state which makes the increment onPress to be so slower 
  until we update/execute our function of handleAmountChange() which is complex data
  Now i notice also "useReducer" is important on incresing my app performance..

*/

function KibandaDetailsScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const AppCtx = useContext(AppContext);
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(true);
  const [availableMenu, setAvailableMenu] = useState();
  // const [cartItems, setCartItems] = useReducer(reducer, []);
  const [cartItems, dispatch] = useReducer(reducer, []);
  // console.log("user id ", AppCtx.usermetadata.get_user_id, restaurant.get_user_id)
  // state is current state, action is incoming action..
  function reducer(state, action) {
    switch (action.type) {
      case "manipulate":
        const { status, mt, kibandaId } = action.payload;
        const mn = action.payload.menu;
        if (!status) {
          return state.filter((item) => +item.id !== +mn.id);
        } else {
          return [...state, { ...mn, ...mt, kibandaId }];
        }

      case "increment":
        // payload hold our incoming metadata
        const { menu } = action.payload;

        if (action.payload.isIngredients) {
          return state.map((item) => {
            if (+item.id === +menu.id) {
              return {
                ...item,
                quantity:
                  item.quantity === "Low"
                    ? "Fair"
                    : item.quantity === "Fair" && "High",
                price: null,
              };
            }
            return item;
          });
        }

        return state.map((item) => {
          if (+item.id === +menu.id) {
            return {
              ...item,
              quantity: +item.quantity + 1,
              totalPrice: +item.price * (+item.quantity + 1),
            };
          }
          return item;
        });

      // return [...state, action.payload];
      case "decrement":
        const menu2 = action.payload.menu;
        if (action.payload.isIngredients) {
          return state.map((item) => {
            if (+item.id === +menu2.id) {
              return {
                ...item,
                quantity:
                  item.quantity === "Fair"
                    ? "Low"
                    : item.quantity === "High" && "Fair",
                price: null,
              };
            }
            return item;
          });
        }

        return state.map((item) => {

          if (+item.id === +menu2.id) {
            return {
              ...item,
              quantity: +item.quantity - 1,
              totalPrice: +item.price * (+item.quantity - 1),
            };
          }
          return item;
        });

      default:
        throw new Error();
    }
  }

  // here in our case the payload is incoming metadata
  // const action = (type, payload) => {
  //   return { type, payload };
  // };

  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [needLogin, setNeedLogin] = useState(false);
  const [comment, setComment] = useState("");
  const inputRef = useRef();
  const [commenttitle, setCommentTitle] = useState("Add review");
  const [enteredComment, setEnteredComment] = useState("");
  const [displayDialogue, setDisplayDialogue] = useState(false);
  const [rating, setRating] = useState();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [kibandaReviews, setKibandaReviews] = useState([]);
  const [youShouldOrderToYourself, setYouShouldOrderToYourself] = useState(false)
  const { width } = Dimensions.get("window");
  const targettedWidth = width * 0.85;

  async function fetchReviews() {
    try {
      setReviewLoading(true);
      const reviews = await fetchKibandaReviews(restaurant.get_user_id);
      setKibandaReviews(reviews);
      setReviewLoading(false);
    } catch (error) {
      setReviewLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    AppCtx.manipulateShowLoadingSpinner(false);
  });

  useEffect(() => {
    const fetchAvailableMenu = async () => {
      if (restaurant.id) {
        try {
          const data = await KibandaTodayAvailableMenu(restaurant.id);
          setAvailableMenu(data);
        } catch (error) {
        }
      } else {
      }
    };

    // if things break u can remove this logic, but there is no way of fetching available menu if the
    // kibanda is closed.
    if (restaurant.is_kibanda_opened) {
      fetchAvailableMenu();
    } else {
      // just give available menu as empty array
      setAvailableMenu([]);
    }
  }, [restaurant]);

  function manipulateCartItems(metadata) {
    dispatch({
      type: "manipulate",
      payload: metadata,
    });
  }

  function placeOrderHandler() {
    setShowAnimation(true);
    setFormSubmitLoader(true);

    // check if kibanda is found or not be4 doing anything..
    isUserExist(restaurant.phone_number).then(data => {
      if (data.message === "User exist") {
        // this are existing code which was working
        if (cartItems.length === 0) {
          setMessage("Select item(s)");
          setIcon("close");
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(() => {
              setFormSubmitLoader(false);
            }, 1000);
          }, 500);
          return;
        }
    
        const totalPrice = cartItems
          .map((item) => +item.totalPrice)
          .reduce((total, num) => total + num, 0);
    
        if (+totalPrice === 0) {
          setMessage("You selected ingredients only");
          setIcon("close");
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(() => {
              setFormSubmitLoader(false);
            }, 1500);
          }, 100);
          return;
        }
    
        const mt = {
          kibandaId: cartItems[0].kibandaId,
          kibandametadata: restaurant,
          metadata: cartItems,
          created_at: new Date().toISOString(),
        };
        AppCtx.manipulateCart(mt);
    
        if (AppCtx.isAunthenticated) {
          if (+AppCtx.usermetadata.get_user_id === +restaurant.get_user_id) {
            setMessage("Can't order yourself.");
            setIcon("close");
            setTimeout(() => {
              setShowAnimation(false);
              setTimeout(() => {
                setFormSubmitLoader(false);
              }, 1500);
            }, 100);
            return;
          }
          else {
            setShowAnimation(false);
            setMessage("Okay");
            setIcon("check");
            setTimeout(() => {
              setFormSubmitLoader(false);
              navigation.navigate("ConfirmOrder");
            }, 1000);
          }
        } else {
          setShowAnimation(false);
          setFormSubmitLoader(false);
          setNeedLogin(true);
        }
      }
      else {
        setShowAnimation(false);
        setFormSubmitLoader(false);
        Alert.alert(
          "Restaurant not found",
          "It seem the restaurant you're trying to access is no longer found, pick another one.",
          [ 
            {
              text: "Okay",
              onPress: () => {
                AppCtx.manipulateShowLoadingSpinner(false);
                AppCtx.manipulateShowLoadingSpinner2(true);
                setTimeout(() => {
                  navigation.navigate("HomeScreen");
                }, 50);
              }
            }
          ]
        )
        // alert("Sorry, restaurant has been deleted!")

      }
      
    }).catch(err => {
      console.log("something went wrong")
      setShowAnimation(false);
      setFormSubmitLoader(false);
      alert(err.message)
    })
  }

  const handleAmountChange = (metadata) => {
    const { status } = metadata;

    // call dispatch and pass the action and payload
    dispatch({
      type: status,
      payload: metadata,
    });

   
  };

  if (AppCtx.showLoadingSpinner2) {
    return <LoadingSpinner />;
  }
  // hii % ya android imeanza kuzingua kwenye "reviews"
  //   https://stackoverflow.com/questions/65045045/react-native-paper-list-accordion
  return (
    <>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <Modal
          visible={displayDialogue}
          onDismiss={() => {
            setEnteredComment("");
            setDisplayDialogue(false);
          }}
          contentContainerStyle={{
            width: "90%",
            minHeight: 200,
            backgroundColor: "white",
            borderRadius: 10,
            alignSelf: "center",
            position: "absolute",
            top: "10%",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              textAlign: "center",
              fontSize: 20,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            Add Comment/Review
          </Text>
          <TextInput
            style={{
              width: "90%",
              alignSelf: "center",
              marginBottom: 12,
            }}
            autoCorrect={false}
            multiline
            numberOfLines={4}
            activeUnderlineColor={"grey"}
            underlineColor={"grey"}
            label="Add Comment"
            value={enteredComment}
            onChangeText={(text) => {
              setEnteredComment(text);
            }}
          />

          <Button
            mode="contained"
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            onPress={() => {
              setDisplayDialogue(false);
              setComment(enteredComment);
              // lets submit our comment to the backend
              rateKibanda({
                user_id: AppCtx.isAunthenticated
                  ? AppCtx.usermetadata.get_user_id
                  : null,
                kibanda_id: restaurant.id,
                rating: rating ? rating : null,
                comment: enteredComment,
              });
            }}
            style={{
              width: "90%",
              alignSelf: "center",
              marginBottom: 5,
              backgroundColor: COLORS.secondary,
            }}
          >
            Submit
          </Button>
        </Modal>

        {/* to place order u should login, but to add review no need to login */}
        <Modal
          visible={needLogin}
          onDismiss={() => setNeedLogin(false)}
          contentContainerStyle={{
            flex: 1,
            height: 330,
            width: 330,
            alignSelf: "center",
            position: "absolute",
            top: "20%",
          }}
        >
          <CustomizedLottieMessage2
            messageHeader={"Need phone number"}
            subHeader={"We need your phone number to track down orders"}
            buttonTitle={"Fill number"}
            buttonTitle2={"Login"}
            cancelHandler={() => setNeedLogin(false)}
            lottieFile={require("../../assets/LottieAnimations/84633-tracking-order.json")}
            understandHandler={() => {
              AppCtx.manipulateAfterLoginNext("PlaceOrder");
              setNeedLogin(false);
              navigation.navigate("Settings", {
                screen: "Register",
                params: {
                  ugroup: "customer",
                },
              });
            }}
            understandHandler2={() => {
              AppCtx.manipulateAfterLoginNext("PlaceOrder");
              setNeedLogin(false);
              navigation.navigate("Settings", {
                screen: "Login",
                params: {
                  next: "ConfirmOrder",
                },
              });
            }}
          />
        </Modal>
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
            styles.container,
            needLogin || displayDialogue
              ? {
                  opacity: 0.05,
                }
              : {
                  opacity: 1,
                },
          ]}
          pointerEvents={
            formSubmitLoader || needLogin || displayDialogue ? "none" : "auto"
          }
        >
          <View
            style={{
              flex: 0.9,
              width: "100%",
            }}
          >
            <KibandaCard1
              needBorder={false}
              style={{
                borderRadius: 0,
              }}
              rating={restaurant.average_ratings}
              location={`${
                restaurant.physical_address.split(", ")[
                  restaurant.physical_address.split(", ").length - 1 - 6
                ]
              }, ${
                restaurant.physical_address.split(", ")[
                  restaurant.physical_address.split(", ").length - 1 - 5
                ]
              }`}
              isFavorite={AppCtx.favoriteVibanda.includes(
                restaurant.get_user_id
              )}
              userId={restaurant.get_user_id}
              brand={restaurant.brand_name}
              opened={restaurant.is_kibanda_opened}
              image={`${BASE_URL}${restaurant.get_cover_photo}`}
            />
          </View>
          <View
            style={{
              flex: 1,
              // width: 400,
            }}
          >
            <ScrollView style={{ flex: 1, width: "100%" }}>
              <View style={{ flex: 1, marginHorizontal: 0, marginVertical: 0 }}>
                <View
                  style={{
                    width: "100%",
                  }}
                >
                  <List.Accordion
                    title="Available Menu"
                    description={"Toggle on to select menu items"}
                    descriptionStyle={{
                      fontFamily: "overpass-reg",
                      color: COLORS.secondary,
                      fontSize: 12,
                    }}
                    expanded={menuExpanded}
                    theme={{
                      colors: { background: "transparent" },
                    }}
                    onPress={() => setMenuExpanded(!menuExpanded)}
                    left={(props) => (
                      <List.Icon {...props} icon="food" color="grey" />
                    )}
                    titleStyle={{
                      padding: 0,
                      margin: 0,
                      fontFamily: "overpass-reg",
                      color: "grey",
                      width: "100%",
                      fontSize: 17,
                    }}
                  ></List.Accordion>
                  {menuExpanded && (
                    <View
                      style={{
                        // display: "flex",
                        marginHorizontal: "7%",
                      }}
                    >
                      {availableMenu ? (
                        restaurant.is_kibanda_opened ? (
                          availableMenu.get_menu
                            .filter((data) => data.type === "menu")
                            .map((menu, index) => (
                              <View
                                key={index}
                                style={{
                                  padding: 0,
                                  margin: 0,
                                  // width: "100%",
                                }}
                              >
                                <MenuItem2
                                  containerStyle={{
                                    marginTop: 0,
                                    paddingTop: 0,
                                    justifyContent: "space-between",
                                  }}
                                  amount={1}
                                  id={menu.parent_menu}
                                  title={menu.menu}
                                  menuItemId={menu.menuItemId}
                                  subTitle={menu.price}
                                  kibandaId={restaurant.id}
                                  handleQuantityChangeHandler={
                                    handleAmountChange
                                  }
                                  toggledHandler={manipulateCartItems}
                                  textStyle={{
                                    color: "grey",
                                  }}
                                />
                              </View>
                            ))
                        ) : (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 12,
                            }}
                          >
                            <Image
                              source={require("../../assets/images/exclamation-mark.png")}
                              style={{
                                width: 15,
                                height: 15,
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "montserrat-17",
                                fontSize: 15,
                                marginLeft: 5,
                                color: "red",
                              }}
                            >
                              Restaurant is closed
                            </Text>
                          </View>
                        )
                      ) : (
                        <LoadingSpinner />
                      )}
                      {availableMenu && restaurant.is_kibanda_opened ? (
                        <View>
                          {availableMenu.get_menu.filter(
                            (data) => data.type === "non-menu"
                          ).length > 0 && (
                            <View
                              style={{
                                marginTop: "5%",
                                marginBottom: "3%",
                                marginLeft: "3%",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "montserrat-17",
                                  fontSize: 18,
                                  color: COLORS.secondary,
                                }}
                              >
                                Ingredients
                              </Text>
                            </View>
                          )}
                          {availableMenu.get_menu.filter(
                            (data) => data.type === "non-menu"
                          ).length > 0 ? (
                            availableMenu.get_menu
                              .filter((data) => data.type === "non-menu")
                              .map((menu, index) => (
                                <View key={index}>
                                  <MenuItem2
                                    containerStyle={{
                                      width: "80%",
                                      marginTop: 0,
                                      paddingTop: 0,
                                      justifyContent: "space-between",
                                    }}
                                    id={menu.parent_menu}
                                    title={menu.menu}
                                    subTitle={menu.price}
                                    menuItemId={menu.menuItemId}
                                    wipeBei
                                    kibandaId={restaurant.id}
                                    handleQuantityChangeHandler={
                                      handleAmountChange
                                    }
                                    toggledHandler={manipulateCartItems}
                                    textStyle={{
                                      color: "grey",
                                    }}
                                    quantityStyle={{
                                      marginTop: 10,
                                    }}
                                  />
                                </View>
                              ))
                          ) : (
                            <></>
                          )}
                        </View>
                      ) : (
                        <></>
                      )}
                      {restaurant.is_kibanda_opened ? (
                        availableMenu && (
                          <View>
                            <Text
                              style={{
                                fontFamily: "overpass-reg",
                                color: "grey",
                                fontSize: 18,
                                marginLeft: 5,
                                textAlign: "center",
                              }}
                            >
                              Total Price: Tsh{" "}
                              {cartItems.length === 0
                                ? "0"
                                : cartItems
                                    .map((item) => +item.totalPrice)
                                    .reduce((total, num) => {
                                      return total + num;
                                    }, 0)}
                              /=
                            </Text>
                          </View>
                        )
                      ) : (
                        <></>
                      )}

                      {restaurant.is_kibanda_opened ? (
                        availableMenu && (
                          <View
                            style={{
                              marginVertical: 20,
                            }}
                          >
                            <Button
                              mode="contained"
                              icon={() => {
                                return (
                                  <MaterialCommunityIcons
                                    name="cart-arrow-right"
                                    size={15}
                                    color="white"
                                  />
                                );
                              }}
                              labelStyle={{
                                fontFamily: "overpass-reg",
                              }}
                              style={{
                                alignSelf: "center",
                                backgroundColor: COLORS.secondary,
                                width: "100%",
                              }}
                              onPress={placeOrderHandler}
                            >
                              Place Order
                            </Button>
                          </View>
                        )
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                  <List.Accordion
                    title="Review and Rate"
                    description={"Add review and rate this restaurant"}
                    descriptionStyle={{
                      fontFamily: "overpass-reg",
                      color: COLORS.secondary,
                      fontSize: 12,
                    }}
                    expanded={reviewsExpanded}
                    theme={{
                      colors: { background: "transparent" },
                    }}
                    onPress={() => setReviewsExpanded(!reviewsExpanded)}
                    left={(props) => (
                      <List.Icon {...props} icon="star" color="grey" />
                    )}
                    titleStyle={{
                      padding: 0,
                      margin: 0,
                      fontFamily: "overpass-reg",
                      color: "grey",
                      fontSize: 17,
                    }}
                  ></List.Accordion>
                  {reviewsExpanded && (
                    <View
                      style={{
                        marginHorizontal: "7%",
                        marginBottom: "7%",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            marginLeft: 15,
                          }}
                        >
                          <Text
                            style={{
                              color: "grey",
                              fontFamily: "overpass-reg",
                              fontSize: 15,
                              marginBottom: 0,
                              paddingBottom: 0,
                            }}
                          >
                            Rate restaurant
                          </Text>
                          <HelperText
                            padding="none"
                            style={{
                              fontFamily: "overpass-reg",
                              color: COLORS.secondary,
                              fontSize: 12,
                              marginTop: 0,
                              paddingTop: 0,
                            }}
                          >
                            ** Tap star to rate
                          </HelperText>
                          <View>
                            <AirbnbRating
                              reviews={[
                                "Very Bad",
                                "Bad",
                                "Ok",
                                "Good",
                                "Excellent",
                              ]}
                              count={5}
                              defaultRating={0}
                              reviewColor={COLORS.secondary}
                              size={30}
                              showRating
                              ratingContainerStyle={{
                                // alignSelf: "center",
                                marginTop: 12,
                                backgroundColor: "#E9ECEF",
                                borderRadius: 10,
                                padding: 10,
                                // marginLeft: "7%",
                              }}
                              reviewSize={20}
                              review
                              onFinishRating={(rating) => {
                                setRating(rating);
                                rateKibanda({
                                  user_id: AppCtx.isAunthenticated
                                    ? AppCtx.usermetadata.get_user_id
                                    : null,
                                  kibanda_id: restaurant.id,
                                  rating: rating,
                                  comment: comment,
                                });
                              }}
                            />
                          </View>
                          <View
                            style={{
                              marginVertical: 10,
                              marginTop: 17,
                            }}
                          >
                            <Text
                              style={{
                                color: "grey",
                                fontFamily: "overpass-reg",
                                fontSize: 15,
                              }}
                            >
                              Add comment and review
                            </Text>
                            <HelperText
                              padding="none"
                              style={{
                                fontFamily: "overpass-reg",
                                color: COLORS.secondary,
                                fontSize: 12,
                                marginTop: 0,
                                paddingTop: 0,
                              }}
                            >
                              ** What you hate/like about this restaurant
                            </HelperText>
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  marginHorizontal: 5,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => setDisplayDialogue(true)}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/hand.png")}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      marginRight: 5,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontFamily: "overpass-reg",
                                      marginVertical: 5,
                                      textDecorationLine: "underline",
                                      color: COLORS.thirdary,
                                    }}
                                  >
                                    {comment.trim().length > 0
                                      ? "Edit review"
                                      : "Add review"}
                                  </Text>
                                </TouchableOpacity>
                                {comment.trim().length > 0 && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setComment("");
                                      setEnteredComment("");
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: "overpass-reg",
                                        color: COLORS.danger,
                                      }}
                                    >
                                      Delete
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                              {comment.trim().length > 0 && (
                                <View
                                  style={{
                                    // width: "100%",  // hii ndo ilikuwa inafanya text container iwe kubwa
                                    backgroundColor: "#E9ECEF",
                                    padding: 10,
                                    borderRadius: 10,
                                    // marginLeft: "7%",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "overpass-reg",
                                      color: "grey",
                                    }}
                                  >
                                    {comment}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        <CustomLine
                          style={{
                            marginVertical: 10,
                          }}
                        />

                        <View
                          style={{
                            // marginLeft: "7%",
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "grey",
                              fontFamily: "overpass-reg",
                              fontSize: 15,
                            }}
                          >
                            People's Reviews and Ratings
                          </Text>
                          <View>
                            {reviewLoading ? (
                              <View
                                style={{
                                  marginVertical: 30,
                                }}
                              >
                                <LoadingSpinner />
                              </View>
                            ) : kibandaReviews.length > 0 ? (
                              kibandaReviews.map((review, index) => (
                                <View
                                  key={index}
                                  style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    backgroundColor: "#E9ECEF",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          color: "grey",
                                          fontSize: 15,
                                          fontFamily: "montserrat-17",
                                        }}
                                      >
                                        Guest
                                      </Text>
                                      <View
                                        style={{
                                          alignItems: "flex-start",
                                        }}
                                      >
                                        <Rating
                                          ratingBackgroundColor="#CED4DA"
                                          tintColor="#E9ECEF"
                                          type="custom"
                                          imageSize={15}
                                          ratingCount={5}
                                          startingValue={review.rating}
                                          readonly
                                        />
                                      </View>
                                    </View>
                                    <View>
                                      <Text
                                        style={{
                                          fontFamily: "montserrat-17",
                                          color: "grey",
                                          fontSize: 11,
                                        }}
                                      >
                                        {`${moment
                                          .utc(review.rated_at)
                                          .local()
                                          .startOf("seconds")
                                          .fromNow()}`}
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    <Text
                                      style={{
                                        fontFamily: "overpass-reg",
                                        color: "black",
                                      }}
                                    >
                                      {review.rating_comment}
                                    </Text>
                                  </View>
                                </View>
                              ))
                            ) : (
                              <View
                                style={{
                                  marginVertical: 20,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "overpass-reg",
                                    color: COLORS.danger,
                                    fontSize: 15,
                                    textAlign: "center",
                                  }}
                                >
                                  No reviews to display
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
}

export default memo(KibandaDetailsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  title: {
    fontFamily: "overpass-reg",
    color: COLORS.secondary,
    fontSize: 20,
  },
});
