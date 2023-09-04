/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomLine from "../components/UI/CustomLine";
import { COLORS } from "../constants/colors";
import { markNotificationDeleted } from "../utils/requests";
import { AppContext } from "../store/context";
import { TransparentPopUpIconMessage } from "../components/UI/Message";
import { Button } from "react-native-paper";
import { Image } from "react-native";

function ViewNotification({ navigation, route }) {
  const { notification } = route.params;
  const AppCtx = useContext(AppContext);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const viewOrderHandler = (taarifa) => {

    const { target, heading } = taarifa;

    if (target === "customer") {
      // we're dealing with customer
      if (heading.toLowerCase().includes("rejected".toLowerCase())) {
        // i need to navigate to rejected one
        // i should use "frist", "second", "third" to determine which screen to navigate to
        AppCtx.manipulateActiveCustomerOrderTabNotification(3)
        AppCtx.manipulateActiveCustomerOrderMetadata({
          tab: "Rejected Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "MtejaOrders",
          params: {
            jumpto: "rejected",
            order_id: taarifa.get_order.order_id,
            oid: taarifa.get_order.id,
          },
        });
      } else if (heading.toLowerCase().includes("cancelled".toLowerCase())) {
        // i need to navigate to cancelle 
        AppCtx.manipulateActiveCustomerOrderTabNotification(2)
        AppCtx.manipulateActiveCustomerOrderMetadata({
          tab: "Cancelled Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "MtejaOrders",
          params: {
            jumpto: "cancelled",
            order_id: taarifa.get_order.order_id,
            oid: taarifa.get_order.id,
          },
        });
      } else if (heading.toLowerCase().includes("completed".toLowerCase())) {
        // i need to redirect to pending order
        AppCtx.manipulateActiveCustomerOrderTabNotification(4)
        AppCtx.manipulateActiveCustomerOrderMetadata({
          tab: "Completed Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "MtejaOrders",
          params: {
            jumpto: "completed",
            order_id: taarifa.get_order.order_id,
            oid: taarifa.get_order.id,
          },
        });
      }
      else if (heading.toLowerCase().includes("accepted".toLowerCase())) {
        // i need to redirect to pending order
        AppCtx.manipulateActiveCustomerOrderTabNotification(1)
        AppCtx.manipulateActiveCustomerOrderMetadata({
          tab: "Accepted Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "MtejaOrders",
          params: {
            jumpto: "accepted",
            order_id: taarifa.get_order.order_id,
            oid: taarifa.get_order.id,
          },
        });
      }
      else {
        // just redirect to pending as default one
        AppCtx.manipulateActiveCustomerOrderTabNotification(0)
        AppCtx.manipulateActiveCustomerOrderMetadata({
          tab: "Pending Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "MtejaOrders",
          params: {
            jumpto: "pending",
            order_id: taarifa.get_order.order_id,
            oid: taarifa.get_order.id,
          },
        });
      }
    }

    if (target === "kibanda") {
      // we're dealing with kibanda
      //   we should navigate to orders

      // i should first make it go to the "Order" parenet tab..
      AppCtx.manipulateActiveParentKibandaPanelTab(1)
      
      if (heading.toLowerCase().includes("rejected".toLowerCase())) {
        // i need to navigate to rejected one
        AppCtx.manipulateActiveKibandaOrderTabNotification(3)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Rejected Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Order",
            },
          },
        });
      } 
      else if (heading.toLowerCase().includes("accepted".toLowerCase())) {
        // i need to redirect to pending order
        AppCtx.manipulateActiveKibandaOrderTabNotification(1)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Accepted Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Order",
            },
          },
        });
      }
      else if (heading.toLowerCase().includes("completed".toLowerCase())) {
        // i need to redirect to pending order
        AppCtx.manipulateActiveKibandaOrderTabNotification(4)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Completed Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Order",
            },
          },
        });
      } else if (heading.toLowerCase().includes("cancelled".toLowerCase())) {
        // i need to navigate to cancelle order
        AppCtx.manipulateActiveKibandaOrderTabNotification(2)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Cancelled Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Order",
            },
          },
        });
      } else if (heading.toLowerCase().includes("pending".toLowerCase())) {
        // i need to redirect to pending order
        AppCtx.manipulateActiveKibandaOrderTabNotification(0)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Pending Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Order",
            },
          },
        });
      } else {
        // just redirect to pending as default one
        AppCtx.manipulateActiveKibandaOrderTabNotification(0)
        AppCtx.manipulateActiveKibandaOrderMetadata({
          tab: "Pending Orders",
          shouldRefresh: true,
        });
        navigation.navigate("Settings", {
          screen: "KibandaDashboard",
          params: {
            screen: "Restaurant",
            params: {
              jumpto: "Orders",
            },
          },
        });
      }
    } else {
      // i don't know what to do
    }
  };

  const onDeleteHandler = async (notification_id) => {
    // make the notification readed, first at context then at the backend..
    setDeleteLoading(true);
    AppCtx.manipulateClearAllNotificationLoading(true);
    try {
      await markNotificationDeleted(notification_id);
      AppCtx.manipulateClearAllNotificationLoading(false);
      setDeleteLoading(false);
      navigation.navigate("NotificationScreen");
    } catch (error) {
      AppCtx.manipulateClearAllNotificationLoading(false);
      setDeleteLoading(false);
      navigation.navigate("NotificationScreen");
    }
  };

  return (
    <>
      {deleteLoading && (
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
            inProcess={deleteLoading}
            textStyle={{
              textAlign: "center",
            }}
          />
        </View>
      )}
      <View
        style={styles.container}
        pointerEvents={deleteLoading ? "none" : "auto"}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginVertical: "2%",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: "grey",
              }}
            >
              From: System
            </Text>
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: "grey",
              }}
            >
              To: me
            </Text>
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: "grey",
              }}
            >
              Date:{" "}
              {notification.created_at
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onDeleteHandler.bind(this, notification.id)}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                color: COLORS.danger,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <CustomLine />
        <View
          style={{
            marginVertical: "2%",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              fontSize: 20,
              textTransform: "capitalize",
            }}
          >
            {notification.heading}
          </Text>
          <Text
            style={{
              fontFamily: "overpass-reg",
              color: "grey",
            }}
          >
            {/* Your orderof this id {notification.order_id} has been rejected by the
          restaurant. Please click below here to check the order details. */}
            {notification.body.trim()}
          </Text>
        </View>
        {notification.is_associted_with_order && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={viewOrderHandler.bind(this, notification)}
          >
            <Image
              source={require("../assets/images/hand.png")}
              style={{
                width: 20,
                height: 20,
                marginHorizontal: "2%",
              }}
            />
            <Text
              style={{
                fontFamily: "overpass-reg",
                marginVertical: "2%",
                textDecorationLine: "underline",
                color: COLORS.thirdary,
              }}
            >
              view order
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});

export default memo(ViewNotification);
