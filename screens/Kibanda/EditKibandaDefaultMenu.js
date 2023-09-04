/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useReducer, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import MenuItem from "../../components/UI/MenuItem";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
import { COLORS } from "../../constants/colors";
import { Button, HelperText } from "react-native-paper";
import {
  addAvailableMealToday,
  editKibandaDefaultMenu,
} from "../../utils/requests";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import MenuPrice from "../../components/UI/MenuPrice";
import { KeyboardAvoidingView } from "react-native";
import CustomLine from "../../components/UI/CustomLine";

function EditKibandaDefaultMenu({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { defaultmenu, allMeals } = route.params;
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [displayPage1, setDisplayPage1] = useState(true);
  const [displayPage2, setDisplayPage2] = useState(false);
  const [selectedMenuItems, dispatch] = useReducer(reducer, {
    existing: [
      {
        name: "Chipsi",
        id: +AppCtx.menuAddedByAdministratorForRestaurantsToChoose.find(
          (value) => value.singular_name === "Chipsi"
        ).id,
        type: "menu",
        price: defaultmenu.get_menu_list.find(
          (dmenu) => dmenu.menuItemName === "Chipsi"
        ).menuItemPrice,
      },
      ...allMeals
        .filter((data) => data.singular_name !== "Chipsi")
        .filter((meal) => {
          return defaultmenu.get_menu_list
            .map((value) => value.parent_menu)
            .includes(meal.id);
        })
        .map((item) => ({
          name: item.singular_name,
          id: item.id,
          type: item.type,
          price: defaultmenu.get_menu_list.find(
            (dmenu) => +dmenu.parent_menu === +item.id
          ).menuItemPrice,
        })),
    ],
    new: [],
  });

  function isAvailableInDefaulMenu(menu) {
    const isExisting = defaultmenu.get_menu_list.find(
      (item) => +item.parent_menu === +menu.id
    );
    return isExisting ? true : false;
  }

  // state is current state, action is incoming action
  // nina action mbili hapa first to add "menu" name/item
  // and then the second actions is to add price to given e
  function reducer(state, action) {
    function isIdAvailableInExistingOrNew(id) {
      const isExisting = state.existing.find((item) => +item.id === +id);
      const isNew = state.new.find((item) => item.id === +id);

      if (isExisting) {
        return "existing";
      }

      if (isNew) {
        return "new";
      }
    }
    switch (action.type) {
      case "addmenuitem":
        const { menu } = action.payload;
        if (!action.payload.status) {
          const isExisting = isAvailableInDefaulMenu(menu);
          if (isExisting) {
            return {
              ...state,
              existing: state.existing.filter((item) => +item.id !== +menu.id),
            };
          } else {
            return {
              ...state,
              new: state.new.filter((item) => +item.id !== +menu.id),
            };
          }
        } else {
          const isExisting = isAvailableInDefaulMenu(menu);
          if (isExisting) {
            return {
              ...state,
              existing: [...state.existing, menu],
            };
          } else {
            return {
              ...state,
              new: [...state.new, menu],
            };
          }
        }

      case "addprice":
        const { id, price } = action.payload;
        const isExisting = isIdAvailableInExistingOrNew(id);

        if (isExisting === "existing") {
          return {
            ...state,
            existing: state.existing.map((item) => {
              if (+item.id === +id) {
                return {
                  ...item,
                  price,
                };
              }
              return {
                ...item,
              };
            }),
          };
        }

        if (isExisting === "new") {
          return {
            ...state,
            new: state.new.map((item) => {
              if (+item.id === +id) {
                return {
                  ...item,
                  price,
                };
              }
              return {
                ...item,
              };
            }),
          };
        }
    }
  }

  // const [selectedMenuItems, setSelectedMenuItems] = useState({
  //   existing: [
  //     {
  //       name: "Chipsi",
  //       id: +AppCtx.menuAddedByAdministratorForRestaurantsToChoose.find(
  //         (value) => value.singular_name === "Chipsi"
  //       ).id,
  //       type: "menu",
  //       price: defaultmenu.get_menu_list.find(
  //         (dmenu) => dmenu.menuItemName === "Chipsi"
  //       ).menuItemPrice,
  //     },
  //     ...allMeals
  //       .filter((data) => data.singular_name !== "Chipsi")
  //       .filter((meal) => {
  //         return defaultmenu.get_menu_list
  //           .map((value) => value.parent_menu)
  //           .includes(meal.id);
  //       })
  //       .map((item) => ({
  //         name: item.singular_name,
  //         id: item.id,
  //         type: item.type,
  //         price: defaultmenu.get_menu_list.find(
  //           (dmenu) => +dmenu.parent_menu === +item.id
  //         ).menuItemPrice,
  //       })),
  //   ],
  //   new: [],
  // });

  function manipulateSelectedMenuItems(metadata) {
    // const { menu, status } = metadata;

    // we should here call the reducer
    dispatch({
      type: "addmenuitem",
      payload: {
        ...metadata,
      },
    });

    /*
      first detect if the incoming metadata existed in the existing default menu..
      then if it exist add it in existing metadata of selectedMenuItems otherwise
      add it inside the "new" metadata..
    */
    // if status can be true or false,
    // if (!status) {
    //   const isExisting = isAvailableInDefaulMenu(menu);
    //   if (isExisting) {
    //     setSelectedMenuItems((prev) => {
    //       return {
    //         ...prev,
    //         existing: prev.existing.filter((item) => +item.id !== +menu.id),
    //       };
    //     });
    //   } else {
    //     setSelectedMenuItems((prev) => {
    //       return {
    //         ...prev,
    //         new: prev.new.filter((item) => +item.id !== +menu.id),
    //       };
    //     });
    //   }
    // } else {
    //   const isExisting = isAvailableInDefaulMenu(menu);
    //   if (isExisting) {
    //     setSelectedMenuItems((prev) => {
    //       return {
    //         ...prev,
    //         existing: [...prev.existing, menu],
    //       };
    //     });
    //   } else {
    //     setSelectedMenuItems((prev) => {
    //       return {
    //         ...prev,
    //         new: [...prev.new, menu],
    //       };
    //     });
    //   }
    // }
  }

  function goToAddPriceHandler() {
    setDisplayPage1(false);
    setDisplayPage2(true);
  }

  function updatePriceOfMenuItemHandler({ id, price }) {
    // call reducer here
    dispatch({
      type: "addprice",
      payload: {
        id,
        price,
      },
    });

    // const isIdAvailableInExistingOrNew = () => {
    //   const isExisting = selectedMenuItems.existing.find(
    //     (item) => +item.id === +id
    //   );
    //   const isNew = selectedMenuItems.new.find((item) => item.id === +id);

    //   if (isExisting) {
    //     return "existing";
    //   }

    //   if (isNew) {
    //     return "new";
    //   }
    // };

    // const type = isIdAvailableInExistingOrNew();

    // if (type === "existing") {
    //   // return;
    //   setSelectedMenuItems((prev) => {
    //     return {
    //       ...prev,
    //       existing: prev.existing.map((item) => {
    //         if (+item.id === +id) {
    //           return {
    //             ...item,
    //             price,
    //           };
    //         }
    //         return {
    //           ...item,
    //         };
    //       }),
    //     };
    //   });
    // }

    // if (type === "new") {
    //   setSelectedMenuItems((prev) => {
    //     return {
    //       ...prev,
    //       new: prev.new.map((item) => {
    //         if (+item.id === +id) {
    //           return {
    //             ...item,
    //             price,
    //           };
    //         }
    //         return {
    //           ...item,
    //         };
    //       }),
    //     };
    //   });
    // }
  }

  function submitFavoriteMeals() {
    Keyboard.dismiss();
    setShowAnimation(true);
    setFormSubmitLoader(true);
    const prices = [...selectedMenuItems.existing, ...selectedMenuItems.new]
      .filter((data) => data.type === "menu")
      .map((item) => item.price);

    if (
      prices.includes(null) ||
      prices.find((item) => isNaN(+item)) ||
      prices.find((item) => item.includes("."))
    ) {
      setMessage("Incorrect Prices");
      setIcon("close");
      setTimeout(() => {
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
        setShowAnimation(false);
      }, 1000);
      return;
    }

    // everything is okay..
    AppCtx.manipulateIsUpdatingAvailableMenu(true);
    const user_id = AppCtx.usermetadata.get_user_id;
    editKibandaDefaultMenu(+user_id, selectedMenuItems, +defaultmenu.id)
      .then((result) => {
        AppCtx.manipulateUserMetadata({
          is_default_meal_added: true,
        });
        AppCtx.manipulateDefaultKibandaMenu(result);
        setMessage("Okay");
        setIcon("check");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          AppCtx.manipulateIsUpdatingAvailableMenu(false);
          navigation.goBack();
        }, 1000);
      })
      .catch((error) => {
        AppCtx.manipulateIsUpdatingAvailableMenu(false);
      });
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
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

      <View
        style={styles.container}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={[
            styles.container,
            {
              width: "100%",
            },
            !displayPage1 && { display: "none" },
          ]}
        >
          <Text style={styles.title}>Add / Edit Default Meal</Text>
          <HelperText
            padding="none"
            style={{
              color: "grey",
              fontFamily: "overpass-reg",
              marginTop: 0,
              paddingTop: 0,
              marginBottom: "6%",
            }}
          >
            Don't wory you can customize it later.
          </HelperText>
          <ScrollView
            style={{
              width: "90%",
            }}
          >
            <MenuItem
              textStyle={{
                color: "grey",
              }}
              title="Chipsi"
              isDefaultItem={true}
            />
            {allMeals
              .filter((value) => value.name !== "Chipsi")
              .filter((data) => data.type === "menu")
              .map((item, index) => (
                <MenuItem
                  textStyle={{
                    color: "grey",
                  }}
                  id={item.id}
                  type={item.type}
                  title={item.name}
                  defaultmenu={defaultmenu}
                  shouldSendDefaultMenuPrice
                  toggledHandler={manipulateSelectedMenuItems}
                  key={index}
                  shouldBeOn={defaultmenu.get_menu_list
                    .map((value) => value.parent_menu)
                    .includes(item.id)}
                />
              ))}
            <Text
              style={{
                fontFamily: "montserrat-17",
                color: COLORS.secondary,
                fontSize: 20,
                marginTop: "5%",
                marginBottom: "3%",
              }}
            >
              Ingredients
            </Text>
            {allMeals
              .filter((value) => value.name !== "Chipsi")
              .filter((data) => data.type !== "menu")
              .map((item, index) => (
                <MenuItem
                  textStyle={{
                    color: "grey",
                  }}
                  id={item.id}
                  title={item.name}
                  type={item.type}
                  defaultmenu={defaultmenu}
                  shouldSendDefaultMenuPrice
                  toggledHandler={manipulateSelectedMenuItems}
                  key={index}
                  shouldBeOn={defaultmenu.get_menu_list
                    .map((value) => value.parent_menu)
                    .includes(item.id)}
                />
              ))}
          </ScrollView>
          <Button
            mode="contained"
            style={{
              backgroundColor: COLORS.secondary,
              marginVertical: "5%",
              marginBottom: "12%",
              borderRadius: 30,
              width: "90%",
            }}
            labelStyle={{
              fontFamily: "montserrat-17",
              fontSize: 16,
              color: COLORS.primary,
            }}
            onPress={goToAddPriceHandler}
          >
            Continue
          </Button>
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              width: "100%",
            },
            !displayPage2 && { display: "none" },
          ]}
          entering={FadeInUp}
          exiting={FadeOutUp}
        >
          <Text style={styles.title}>Add / Edit Default Meal's Price</Text>

          <CustomLine
            style={{
              borderBottomColor: "blue",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "80%",
            }}
          >
            <HelperText
              padding="none"
              style={{
                color: "grey",
                fontFamily: "overpass-reg",
              }}
            >
              Need to edit menu items?
            </HelperText>
            <TouchableOpacity
              style={{
                marginLeft: "1%",
              }}
              onPress={() => {
                Keyboard.dismiss();
                setDisplayPage1(true);
                setDisplayPage2(false);
              }}
            >
              <HelperText
                padding="none"
                style={{
                  color: COLORS.secondary,
                  fontFamily: "montserrat-17",
                }}
              >
                Click here
              </HelperText>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              flex: 1,
              width: "80%",
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                width: "100%",
              }}
            >
              {[...selectedMenuItems.existing, ...selectedMenuItems.new]
                .filter((menu) => {
                  return menu.type === "menu";
                })
                .map((value, key) => (
                  <MenuPrice
                    onChangeHandler={updatePriceOfMenuItemHandler}
                    key={key}
                    title={value.name}
                    id={value.id}
                    price={value.price}
                  />
                ))}
              <Button
                mode="contained"
                style={{
                  backgroundColor: COLORS.secondary,
                  marginTop: "5%",
                  borderRadius: 30,
                }}
                labelStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 16,
                  color: COLORS.primary,
                }}
                onPress={submitFavoriteMeals}
              >
                Finish
              </Button>
              
            </KeyboardAvoidingView>
            <View
              style={{
                height: 500,
              }}
            ></View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

export default memo(EditKibandaDefaultMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "overpass-reg",
    fontSize: 22,
    color: "grey",
    marginTop: "5%",
  },
});
