/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";
import ToggleSwitch from "toggle-switch-react-native";
import CustomLine from "./CustomLine";
import { HelperText } from "react-native-paper";
import { AppContext } from "../../store/context";

function MenuItem2({
  title,
  toggledHandler,
  isDefaultItem,
  id,
  amount,
  textStyle,
  removeline,
  containerStyle,
  subTitle,
  kibandaId,
  handleQuantityChangeHandler,
  wipeBei,
  quantityStyle,
  menuItemId,
}) {
  const AppCtx = useContext(AppContext);

  const [isOn, setIsOn] = useState(false);
  const [totalPrice, setTotalPrice] = useState(subTitle);
  const [quantity, setQuantity] = useState(wipeBei ? "Fair" : 1);
  function handleOnToggle(status) {
    setIsOn(status);
    toggledHandler({
      menu: { id: +id, name: title, price: subTitle },
      status,
      kibandaId,
      mt: { totalPrice, quantity },
    });
  }
  return (
    <View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginBottom: 10,
          },
        ]}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
            },
            containerStyle,
          ]}
        >
          <View>
            <Text
              style={[
                {
                  fontFamily: "montserrat-17",
                  fontSize: 16,
                  color: COLORS.primary,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            <HelperText
              style={[
                {
                  fontFamily: "montserrat-17",
                  fontSize: 12,
                  color: COLORS.secondary,
                  marginBottom: 0,
                  paddingBottom: 0,
                },
                wipeBei && { display: "none" },
              ]}
              padding="none"
            >
              Bei: Tsh {totalPrice}/=
            </HelperText>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                },
                quantityStyle,
              ]}
            >
              <HelperText
                style={{
                  fontFamily: "montserrat-17",
                  fontSize: 12,
                  marginTop: 0,
                  paddingTop: 0,
                  color: COLORS.secondary,
                }}
                padding="none"
              >
                Quantity
              </HelperText>
              <View
                style={{
                  width: wipeBei ? 100 : 100,
                  height: 25,
                  borderColor: "grey",
                  borderWidth: 1,
                  marginLeft: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "27%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey",
                    backgroundColor: COLORS.secondary,
                  }}
                  onPress={() => {
                    // this is decrement...
                    if (quantity < 2) {
                      return;
                    }
                    if (quantity === "Low") {
                      return;
                    }
                    if (wipeBei) {
                      // then we don't need to change the price and quantity
                      if (quantity === "Fair") {
                        setQuantity("Low");
                      }
                      if (quantity === "High") {
                        setQuantity("Fair");
                      }
                      handleQuantityChangeHandler({
                        status: "decrement",
                        menu: {
                          id: +id,
                          name: title,
                          price: subTitle,
                          menuItemId,
                        },
                        isIngredients: true,
                      });
                      return;
                    }
                    setQuantity((prevState) => prevState - 1);
                    setTotalPrice((prevState) => +prevState - +subTitle);
                    handleQuantityChangeHandler({
                      status: "decrement",
                      menu: {
                        id: +id,
                        name: title,
                        price: subTitle,
                        menuItemId,
                      },
                    });
                  }}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: "46%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey",
                    backgroundColor: COLORS.secondary,
                    borderLeftWidth: 1,
                    borderLeftColor: "grey",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      textTransform: "capitalize",
                      color: "#343A40",
                    }}
                  >
                    {quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: "27%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey",
                    backgroundColor: COLORS.secondary,
                    borderLeftWidth: 1,
                    borderLeftColor: "grey",
                  }}
                  onPress={() => {
                    // this is increment...
                    if (quantity === "High") {
                      return;
                    }
                    if (wipeBei) {
                      if (quantity === "Low") {
                        setQuantity("Fair");
                      }
                      if (quantity === "Fair") {
                        setQuantity("High");
                      }
                      handleQuantityChangeHandler({
                        status: "increment",
                        menu: {
                          id: +id,
                          name: title,
                          price: subTitle,
                          menuItemId,
                        },
                        isIngredients: true,
                      });
                      return;
                    }
                    setQuantity((prevState) => prevState + 1);
                    setTotalPrice((prevState) => +prevState + +subTitle);
                    handleQuantityChangeHandler({
                      status: "increment",
                      menu: {
                        id: +id,
                        name: title,
                        price: subTitle,
                        menuItemId,
                      },
                    });
                  }}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <ToggleSwitch
          isOn={isDefaultItem ? true : isOn}
          onColor={COLORS.secondary}
          offColor="grey"
          disabled={isDefaultItem ? true : false}
          onToggle={handleOnToggle}
        />
      </View>
      {!removeline && <CustomLine />}
    </View>
  );
}

export default memo(MenuItem2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
});
