/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomLine from "./CustomLine";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import {
  markNotificationAsRead,
  markNotificationDeleted,
} from "../../utils/requests";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../store/context";

function NotificationCard({ notification, needRefresh, loadingHandler }) {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);
  const onDeleteHandler = async (id) => {
    loadingHandler(true);
    try {
      const not = await markNotificationDeleted(id);
      // i think i should drag top the flatlist to refresh
      needRefresh();
    } catch (error) {
      // alert("Error ", error.message)

    }
    loadingHandler(false);
  };
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        AppCtx.markNotificationAsRead(notification.id);
        // then lets also manipulate our backend to save notification as read
        markNotificationAsRead(notification.id);
        navigation.navigate("NotificationDetails", {
          notification: notification,
        });
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 70,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "flex-start",
            marginLeft: 10,
          }}
        >
          <View
            style={{
              width: "75%",
              height: "100%",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "overpass-reg",
                textTransform: "capitalize",
                fontSize: 17,
                marginBottom: 5,
                color: notification.is_read ? "grey" : "black",
              }}
            >
              {notification.heading}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: "overpass-reg",
                color: "grey",
              }}
            >
              {notification.body}
            </Text>
          </View>
          <View
            style={{
              width: "25%",
              height: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "grey",
                fontFamily: "montserrat-17",
                fontSize: 11,
              }}
            >
              {`${moment
                .utc(notification.created_at)
                .local()
                .startOf("seconds")
                .fromNow()}`}
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 20,
                padding: 10,
              }}
              onPress={onDeleteHandler.bind(this, notification.id)}
            >
              <AntDesign name="delete" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>

        <CustomLine />
      </View>
    </TouchableOpacity>
  );
}

export default memo(NotificationCard);
