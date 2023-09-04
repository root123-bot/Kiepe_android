/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";
import ToggleSwitch from "toggle-switch-react-native";
import CustomLine from "./CustomLine";
import { HelperText } from "react-native-paper";
import { AppContext } from "../../store/context";

function MenuItem3({
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
  inactivate,
}) {
  const AppCtx = useContext(AppContext);

  const [isOn, setIsOn] = useState(isDefaultItem ? true : false);
  const [totalPrice, setTotalPrice] = useState(subTitle);
  const [quantity, setQuantity] = useState(wipeBei ? "Fair" : 1);

  //   its aim is to disable toggle if another one is selected
  useEffect(() => {
    if (inactivate) {
      setIsOn(false);
    }
  }, [inactivate]);

  function handleOnToggle(status) {
    setIsOn(status);
    toggledHandler({ status, id });
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
                  color: "grey",
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {/* nikitoa hii helperText nikichange in Text app ina-crash */}
            <HelperText
              style={[
                {
                  fontFamily: "montserrat-17",
                  fontSize: 15,
                  color: COLORS.secondary,
                  marginBottom: 0,
                  paddingBottom: 0,
                },
                wipeBei && { display: "none" },
              ]}
              padding="none"
            >
              {`Bei: Tsh ${subTitle}/=`}
            </HelperText>
          </View>
        </View>

        <ToggleSwitch
          isOn={isOn}
          onColor={COLORS.secondary}
          offColor="grey"
          onToggle={handleOnToggle}
        />
      </View>
      <CustomLine />
    </View>
  );
}

export default memo(MenuItem3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
});
