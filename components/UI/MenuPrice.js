/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

function MenuPrice({ title, id, price, onChangeHandler }) {
  const [itemPrice, setItemPrice] = useState(price ? price : "");
  return (
    <View
      style={{
        marginVertical: "2%",
      }}
    >
      <TextInput
        label={title}
        mode="outlined"
        keyboardType="numeric"
        autoCorrect={false}
        value={itemPrice}
        activeOutlineColor="grey"
        activeUnderlineColor="grey"
        onChangeText={(text) => {
          setItemPrice(text);
          onChangeHandler({ id, price: text });
        }}
      />
    </View>
  );
}

export default memo(MenuPrice);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
