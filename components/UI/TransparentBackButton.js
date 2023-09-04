import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { memo, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { AppContext } from "../../store/context";
import CustomLine from "./CustomLine";

function TransparentBackgroundButton({ title, subtitle, icon, color }) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  function logoutHandler() {
    AppCtx.logout();
  }
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            AppCtx.manipulateActiveCustomerOrderTabNotification(0)
            AppCtx.manipulateActiveCustomerOrderMetadata({
              tab: "Pending Orders",
              shouldRefresh: true,
            });
            navigation.navigate("MtejaOrders");
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.iconHolder}>
              <Ionicons name="cart" size={30} color="grey" />
            </View>
            <View>
              <Text style={styles.title}>
                View Orders ({AppCtx.customerOrders ? AppCtx.customerOrders.length : 0})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <CustomLine style={styles.customLine} />

        <TouchableOpacity
          onPress={() => {
            AppCtx.manipulateTargettedChangePassword("customer");
            navigation.navigate("ChangePassword");
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.iconHolder}>
              <Ionicons name="lock-closed" size={30} color="grey" />
            </View>
            <View>
              <Text style={styles.title}>Change Password</Text>
            </View>
          </View>
        </TouchableOpacity>
        <CustomLine style={styles.customLine} />
        <TouchableOpacity onPress={logoutHandler}>
          <View style={styles.itemContainer}>
            <View style={styles.iconHolder}>
              <MaterialIcons name="logout" size={30} color="grey" />
            </View>
            <View>
              <Text style={styles.title}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(TransparentBackgroundButton);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "black",
    marginBottom: 10,
    opacity: 0.7,
  },
  itemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  iconHolder: {
    marginRight: 20,
    marginLeft: 10,
  },
  customLine: {
    marginHorizontal: 10,
    marginBottom: 0,
  },
  title: {
    fontFamily: "montserrat-17",
    color: "white",
  },
  title1: {
    fontFamily: "overpass-reg",
    fontSize: 12,
    color: "white",
  },
});
