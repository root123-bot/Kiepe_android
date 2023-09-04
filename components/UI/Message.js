/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/colors";
import CustomLine from "./CustomLine";
import LottieView from "lottie-react-native";
import { Button, HelperText } from "react-native-paper";
import { useEffect, useRef } from "react";
import Animation from "../Map/Animation";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export const ToastNotification = ({
  messageHeader,
  messageDescription,
  color,
}) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 70,
        backgroundColor: `${color}`,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 40,
        borderRadius: 5,
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#003049",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      <Icon name="info" size={30} color="#f6f4f4" />
      <View>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "bold",
            marginLeft: 10,
            fontSize: 16,
          }}
        >
          {messageHeader}
        </Text>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "500",
            marginLeft: 10,
            fontSize: 14,
          }}
        >
          {messageDescription}
        </Text>
      </View>
    </Animated.View>
  );
};

// TransparentPopUpIcon message at center of screen inspired by all football...
export const TransparentPopUpIconMessage = ({
  messageHeader,
  icon,
  inProcess,
  textStyle,
}) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View>
        <View style={{ alignItems: "center" }}>
          {inProcess ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Icon name={icon} size={50} color="#f6f4f4" />
          )}
        </View>
        {!inProcess && (
          <Text
            style={[
              {
                fontFamily: "montserrat-17",
                color: "white",
              },
              textStyle,
            ]}
          >
            {messageHeader}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export const LottieMessage = ({
  messageHeader,
  icon,
  inProcess,
  understandHandler,
  useCurrentLocationHandler,
}) => {
  const animationRef = useRef(null);
  // https://www.npmjs.com/package/lottie-react-native
  useEffect(() => {
    // this is same to say >>> animationRef.current && animationRef.current.play();
    animationRef.current?.play();
  });

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              fontSize: 20,
              textAlign: "center",
              marginTop: "2%",
              marginBottom: "1%",
              paddingBottom: 0,
            }}
          >
            Add Business Location
          </Text>
          <CustomLine
            style={{
              marginBottom: 0,
              paddingBottom: 0,
            }}
          />
          <HelperText
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              marginBottom: 0,
              paddingBottom: 0,
            }}
            numberOfLines={1}
          >
            Click on the map to pin your business location.
          </HelperText>
          {/* you should appreciate the code you have got here to make our Animation work 
          just read throught that issue https://github.com/lottie-react-native/lottie-react-native/issues/925
          view the "Animation" component for more */}
          <Animation
            style={{
              width: 200,
              marginTop: 0,
              alignSelf: "center",
              paddingTop: 0,
              aspectRatio: 1,
            }}
            source={require("../../assets/LottieAnimations/86234-select-location.json")}
          />
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
            }}
            icon="arrow-right"
            mode="contained"
            onPress={useCurrentLocationHandler}
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "#33B5E5",
              marginBottom: "5%",
            }}
          >
            Use, Current Location
          </Button>
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
            }}
            icon="hand-okay"
            mode="contained"
            onPress={understandHandler}
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: COLORS.secondary,
              marginBottom: "2%",
            }}
          >
            Pin, instead
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

export const CustomizedLottieMessage = ({
  messageHeader,
  subHeader,
  lottieFile,
  buttonTitle,
  lottiestyle,
  buttonStyle,
  understandHandler,
}) => {
  const animationRef = useRef(null);
  // https://www.npmjs.com/package/lottie-react-native
  useEffect(() => {
    // this is same to say >>> animationRef.current && animationRef.current.play();
    animationRef.current?.play();
  });

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              fontSize: 20,
              textAlign: "center",
              marginTop: "2%",
              marginBottom: "1%",
              paddingBottom: 0,
            }}
          >
            {messageHeader}
          </Text>
          <CustomLine
            style={{
              marginBottom: 0,
              paddingBottom: 0,
            }}
          />
          <HelperText
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              marginBottom: 0,
              paddingBottom: 0,
            }}
            numberOfLines={1}
          >
            {subHeader}
          </HelperText>

          <Animation
            style={[
              {
                width: 200,
                marginTop: 0,
                alignSelf: "center",
                paddingTop: 0,
                aspectRatio: 1,
              },
              lottiestyle,
            ]}
            source={lottieFile}
          />
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
            }}
            icon="hand-okay"
            mode="contained"
            onPress={understandHandler}
            style={[
              {
                width: "90%",
                alignSelf: "center",
                backgroundColor: COLORS.secondary,
                marginBottom: "2%",
              },
              buttonStyle,
            ]}
          >
            {buttonTitle}
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

export const CustomizedLottieMessage2 = ({
  messageHeader,
  subHeader,
  lottieFile,
  buttonTitle,
  buttonTitle2,
  lottiestyle,
  buttonStyle,
  understandHandler,
  understandHandler2,
  cancelHandler,
}) => {
  const animationRef = useRef(null);
  // https://www.npmjs.com/package/lottie-react-native
  useEffect(() => {
    // this is same to say >>> animationRef.current && animationRef.current.play();
    animationRef.current?.play();
  });

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                color: COLORS.primary,
                fontSize: 20,
                marginTop: "2%",
                width: "90%",
                marginBottom: "1%",
                paddingBottom: 0,
                textAlign: "center",
              }}
            >
              {messageHeader}
            </Text>
            <TouchableOpacity onPress={cancelHandler}>
              <AntDesign name="closecircle" size={22} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
          <CustomLine
            style={{
              marginBottom: 0,
              paddingBottom: 0,
            }}
          />
          <HelperText
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              marginBottom: 0,
              paddingBottom: 0,
              textAlign: "center",
            }}
          >
            {subHeader}
          </HelperText>

          <Animation
            style={[
              {
                width: 200,
                marginTop: 0,
                alignSelf: "center",
                paddingTop: 0,
                aspectRatio: 1,
              },
              lottiestyle,
            ]}
            source={lottieFile}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "3%",
              justifyContent: "space-between",
            }}
          >
            <Button
              labelStyle={{
                fontFamily: "montserrat-17",
                color: COLORS.primary,
              }}
              mode="contained"
              onPress={understandHandler}
              style={[
                {
                  width: "46%",
                  alignSelf: "center",
                  backgroundColor: "grey",
                  marginBottom: "2%",
                },
                buttonStyle,
              ]}
            >
              {buttonTitle}
            </Button>
            <Button
              labelStyle={{
                fontFamily: "montserrat-17",
                color: COLORS.primary,
              }}
              mode="contained"
              onPress={understandHandler2}
              style={[
                {
                  width: "46%",
                  alignSelf: "center",
                  backgroundColor: COLORS.secondary,
                  marginBottom: "2%",
                },
                buttonStyle,
              ]}
            >
              {buttonTitle2}
            </Button>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
