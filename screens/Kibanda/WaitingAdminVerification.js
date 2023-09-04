/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Background from "../../components/UI/Background";
import MapSearchBar from "../../components/UI/MapSearchBar";
import { CustomizedLottieMessage } from "../../components/UI/Message";

function WaitingAdminVerification({ navigation }) {
  return (
    <Background>
      <View
        style={{
          flex: 1,
          height: 330,
          width: 330,
          alignSelf: "center",
          position: "absolute",
          top: "40%",
          zIndex: 100000000,
        }}
      >
        <CustomizedLottieMessage
          messageHeader="Need Admin Verification"
          subHeader={"Your account is not yet verified by the admin"}
          lottieFile={require("../../assets/LottieAnimations/69919-code-review.json")}
          lottiestyle={{
            marginBottom: 6,
            marginTop: 0,
            paddingTop: 0,
          }}
          buttonTitle="I understand"
          understandHandler={() => navigation.navigate("Setting")}
        />
      </View>
    </Background>
  );
}

export default memo(WaitingAdminVerification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
