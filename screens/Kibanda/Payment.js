/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import MenuItem2 from "../../components/UI/MenuItem2";
import MenuItem3 from "../../components/UI/MenuItem3";
import { COLORS } from "../../constants/colors";
import { AppContext } from "../../store/context";
import { processPayments } from "../../utils/requests";

const deviceHeight = Dimensions.get("window").height;

function Payment() {
  const AppCtx = useContext(AppContext);
  const [bundleType, setBundleType] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [inactivate1, setInactivate1] = useState(false);
  const [inactivate2, setInactivate2] = useState(false);
  const [inactivate3, setInactivate3] = useState(false);
  const [malipoActive1, setMalipoActive1] = useState(false);
  const [malipoActive2, setMalipoActive2] = useState(false);
  const [malipoActive3, setMalipoActive3] = useState(false);
  const [showFormSubmitLoader, setShowFormSubmitLoader] = useState(false);

  const [phone, setPhone] = useState("");
  async function lipiaHandler() {
    if (
      phone.trim().length !== 10 ||
      isNaN(+phone.trim() || phone.trim()[0] !== "0")
    ) {
      alert("Tafadhali ingiza namba ya simu sahihi");
      return;
    }

    const metadata = {
      user_id: AppCtx.usermetadata.get_user_id,
      payment_method: "2",
      amount: 1000,
      phone_number: phone,
    };

    setShowFormSubmitLoader(true);
    try {
      const output = await processPayments(metadata);
    } catch (error) {
    }
    // setShowFormSubmitLoader(false);
    setShowFormSubmitLoader(false);
  }
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      //   behavior={"padding"}
    >
      <ScrollView
        style={{
          flex: 1,
          padding: 15,
        }}
        pointerEvents={showFormSubmitLoader ? "none" : "auto"}
      >
        <Text
          style={{
            color: "grey",
            fontSize: 20,
            fontFamily: "overpass-reg",
          }}
        >
          Chagua Kifurushi Ukipendacho
        </Text>
        <View
          style={{
            marginVertical: 20,
          }}
        >
          <MenuItem3
            inactivate={inactivate1}
            toggledHandler={(mt) => {
              if (mt.status) {
                setBundleType(1);
                setInactivate1(false);
                setInactivate2(true);
                setInactivate3(true);
              }
              // setBundleType(1)}
            }}
            id={1}
            title="Kwa siku"
            isDefaultItem={true}
            subTitle="1000"
          />
          <MenuItem3
            inactivate={inactivate2}
            toggledHandler={(mt) => {

              if (mt.status) {
                setBundleType(2);
                setInactivate1(true);
                setInactivate2(false);
                setInactivate3(true);
              }
              // setBundleType(2)}
            }}
            id={2}
            title="Kwa wiki"
            subTitle="3000"
          />
          <MenuItem3
            inactivate={inactivate3}
            toggledHandler={(mt) => {

              if (mt.status) {
                setBundleType(3);
                setInactivate1(true);
                setInactivate2(true);
                setInactivate3(false);
              }
              // setBundleType(3)}
            }}
            id={3}
            title="Kwa mwezi"
            subTitle="10000"
          />
        </View>
        <Text
          style={{
            color: "grey",
            fontSize: 20,
            fontFamily: "overpass-reg",
          }}
        >
          Changua Njia Ya Malipo
        </Text>
        <View
          style={{
            marginVertical: 20,
          }}
        >
          <MenuItem3
            wipeBei
            inactivate={malipoActive1}
            toggledHandler={(mt) => {
              if (mt.status) {
                setPaymentMethod(1);
                setMalipoActive1(false);
                setMalipoActive2(true);
                setMalipoActive3(true);
              }
              // setBundleType(1)}
            }}
            id={1}
            title="M-PESA"
            isDefaultItem={true}
            subTitle="1000"
          />
          <MenuItem3
            wipeBei
            inactivate={malipoActive2}
            toggledHandler={(mt) => {

              if (mt.status) {
                setPaymentMethod(2);
                setMalipoActive1(true);
                setMalipoActive2(false);
                setMalipoActive3(true);
              }
              // setBundleType(2)}
            }}
            id={2}
            title="Tigo Pesa"
            subTitle="3000"
          />
          <MenuItem3
            inactivate={malipoActive3}
            wipeBei
            toggledHandler={(mt) => {

              if (mt.status) {
                setPaymentMethod(3);
                setMalipoActive1(true);
                setMalipoActive2(true);
                setMalipoActive3(false);
              }
              // setBundleType(3)}
            }}
            id={3}
            title="Airtel Money"
            subTitle="10000"
          />
        </View>

        <Text
          style={{
            color: "grey",
            fontSize: 20,
            fontFamily: "overpass-reg",
          }}
        >
          Jaza Namba Ya Simu
        </Text>
        <View>
          <TextInput
            maxLength={10}
            keyboardType="number-pad"
            placeholder="0XXXXXXXXX"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            mode="outlined"
            label="Namba ya simu"
          />
          <Button
            mode="contained"
            labelStyle={{
              color: "white",
              fontFamily: "montserrat-17",
            }}
            loading={showFormSubmitLoader}
            onPress={lipiaHandler}
            style={{ marginTop: 20, backgroundColor: COLORS.secondary }}
          >
            Lipa
          </Button>
        </View>
        <View
          style={{
            height: Platform.OS === "ios" ? 200 : 100,
          }}
        ></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default memo(Payment);
