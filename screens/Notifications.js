/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { memo, useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { View, FlatList } from "react-native";
import { Button, HelperText } from "react-native-paper";
import KibandaCardCart from "../components/UI/KibandaCardCart";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { TransparentPopUpIconMessage } from "../components/UI/Message";
import NotificationCard from "../components/UI/NoficationCard";
import { COLORS } from "../constants/colors";
import { AppContext } from "../store/context";
import { userNotifications } from "../utils/requests";

function NotificationCenter({ navigation }) {
  const AppCtx = useContext(AppContext);
  const { cart } = AppCtx;

  const [notifications, setNotifications] = useState(AppCtx.usernotifications);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const refreshHandler = async () => {
    fetchNotification();
  };

  const fetchNotification = async () => {
    setLoading(true);
    try {
      const notifications = await userNotifications(
        AppCtx.usermetadata.get_user_id
      );
      setNotifications(notifications);
      AppCtx.updateusernotifications(notifications);
    } catch (error) {
      // alert("Error : ", error.message)
    }
    setLoading(false);
  };

  useEffect(() => {
    if (AppCtx.clearAllNotificationLoading) {
      fetchNotification();
    }
  }, [AppCtx.clearAllNotificationLoading]);

  useEffect(() => {
    fetchNotification();
  }, []);

  {
    !notifications && (
      <View
        style={{
          flex: 1,
        }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  // hapa itabidi nitumie ListView ili mtu awe na uweza wa ku-refresh for notifications..
  return (
    <>
      <StatusBar style="dark" />
      {!AppCtx.isAunthenticated ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              fontSize: 20,
              color: "grey",
            }}
          >
            Login to view notifications
          </Text>
          <Button
            style={{
              marginVertical: 20,
            }}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            contentStyle={{
              backgroundColor: COLORS.secondary,
            }}
            mode="contained"
            onPress={() => navigation.navigate("Login")}
          >
            Login here
          </Button>
        </View>
      ) : (
        notifications.length === 0 && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "overpass-reg",
                textAlign: "center",
                fontSize: 16,
                color: "grey",
              }}
            >
              No notifcation yet
            </Text>
            <HelperText
              padding="none"
              style={{
                textAlign: "center",
                fontFamily: "overpass-reg",
              }}
            >
              Drag down to refresh
            </HelperText>
          </View>
        )
      )}
      {deleteLoading ||
        (AppCtx.clearAllNotificationLoading && (
          <View
            style={{
              flex: 1,
              height: 150,
              width: 150,
              alignSelf: "center",
              position: "absolute",
              top: "40%",
              zIndex: 10,
            }}
          >
            <TransparentPopUpIconMessage
              messageHeader={"Success"}
              icon={"check"}
              inProcess={deleteLoading || AppCtx.clearAllNotificationLoading}
              textStyle={{
                textAlign: "center",
              }}
            />
          </View>
        ))}
      <View
        style={{
          marginVertical: 30,
          marginHorizontal: 10,
          flex: 1,
        }}
        pointerEvents={
          deleteLoading || AppCtx.clearAllNotificationLoading ? "none" : "auto"
        }
      >
        {notifications.length === 0 ? (
          <FlatList
            refreshing={loading}
            onRefresh={fetchNotification}
            style={{
              flex: 1,
            }}
          />
        ) : (
          <FlatList
            style={{
              flex: 1,
            }}
            keyExtractor={(item) => item.id.toString()}
            data={AppCtx.usernotifications}
            refreshing={loading}
            onRefresh={fetchNotification}
            renderItem={({ item }) => (
              <NotificationCard
                needRefresh={refreshHandler}
                notification={item}
                loadingHandler={setDeleteLoading}
              />
            )}
          />
        )}
      </View>
    </>
  );
}

export default memo(NotificationCenter);
