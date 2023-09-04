/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unstable-nested-components */
// 0623082153
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import AppContextProvider, { AppContext } from "./store/context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./screens/Map";
import SettingScreen from "./screens/Settings";
import { Ionicons } from "@expo/vector-icons";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import EnterOTPScreen from "./screens/Auth/EnterOTPScreen";
import SetLoginPin from "./screens/Auth/SetPinScreen";
import CompleteProfile from "./screens/Kibanda/CompleteProfile";
import DashboardScreen from "./screens/Kibanda/TopTabs/Dashboard";
import WaitingAdminVerification from "./screens/Kibanda/WaitingAdminVerification";
import MapViewScreen from "./screens/Kibanda/MapView";
import { COLORS } from "./constants/colors";
import Animation from "./components/Map/Animation";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
  StyleSheet,
  BackHandler,
  Linking,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./screens/Kibanda/CustomDrawer";
import Orders from "./screens/Kibanda/TopTabs/Orders";
import Menus from "./screens/Kibanda/TopTabs/Menus";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Badge } from "react-native-elements";
import DefaultMeal from "./components/Kibanda/DefaultMeal";
import AddTodayAvailableMeal from "./screens/Kibanda/AddTodayAvailableMeal";
import { _cacheResourcesAsync } from "./utils";
import KibandaDetailsScreen from "./screens/Kibanda/KibandaDetailsScreen";
import KibandaDetailsScreen2 from "./screens/Kibanda/KibandaDetailsScreen2";
import EditKibandaDefaultMenu from "./screens/Kibanda/EditKibandaDefaultMenu";
import NotificationCenter from "./screens/Notifications";
import ConfirmOrder from "./screens/Kibanda/ConfirmOrder";
import * as Notifications from "expo-notifications";
import CustomerOrders from "./screens/Customer/Orders";
import CustomerCancelledOrders from "./screens/Customer/CancelledOrders";
import CustomerRejectedOrders from "./screens/Customer/RejectedOrders";
import PendingOrders from "./components/Kibanda/PendingOrders";
import RejectedOrders from "./components/Kibanda/RejectedOrders";
import CancelledOrders from "./components/Kibanda/CancelledOrders";
import { clearAllUserNotifications } from "./utils/requests";
import ViewNotification from "./screens/ViewNotification";
import CustomerCompletedOrders from "./screens/Customer/CompletedOrders";
import CompletedOrders from "./components/Kibanda/CompletedOrders";
import EditKibandaProfileScreen from "./screens/Kibanda/EditProfile";
import ChangePasswordScreen from "./screens/ChangePassword";
import CustomerAcceptedOrders from "./screens/Customer/AcceptedOrders";
import AcceptedOrders from "./screens/Kibanda/AcceptedOrders";
import ForgotPassword from "./screens/Auth/ForgotPassword";
import Payment from "./screens/Kibanda/Payment";
import NetInfo from "@react-native-community/netinfo";
import VersionCheck from "react-native-version-check";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

// import TabIcon from "./components/UI/TabIcons";
const Stack = createNativeStackNavigator();
const Stack1 = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabIcon({ focused, color, size, name }) {
  return <Ionicons color={focused ? color : "grey"} name={name} size={size} />;
}

function MyTopTabs({ route }) {
  const AppCtx = useContext(AppContext)
  let jumpto;
  if (route.params) {
    jumpto = route.params.jumpto;
  }

  let initialRoute = 0;
  if (jumpto === "Dashboard") {
    initialRoute = 0;
  } else if (jumpto === "Order") {
    initialRoute = 1;
  } else if (jumpto === "Menu") {
    initialRoute = 2;
  } else if (jumpto === "Completed") {
    initialRoute = 3;
  }
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(initialRoute);
  const [routes] = useState([
    { key: "first", title: "Dashboard" },
    { key: "second", title: "Orders" },
    { key: "third", title: "Menus" },
  ]);

  return (
    <>
      {/* this is parent component which holds all the top tabs so you can set the status bar 
      of all top tabs screens here; i struggled now i came to solution and everything is good... */}
      <StatusBar style="dark" />
      <TabView
        renderTabBar={renderTabBar.bind(this, layout)}
        navigationState={{ index: AppCtx.activeParentKibandaPanelTab , routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

// learn all about tabs https://www.npmjs.com/package/react-native-tab-view
const renderScene = SceneMap({
  first: DashboardScreen,
  // second: Orders,
  second: KibandaOrderTopTabs,
  third: Menus,
});

{
  /*
  by the way display "badge" kama huwezi kuto-idisplay if the given tab is active then achana nayo.. nimecheck 
  kwenye "AllFootball" badge ipo palepale hata kama ukienda kwenye tab yenye badge bado inakuwepo inachange endapo
  utafungua hiyo message/notification ambayo hujasoma...
*/
}

const renderTabBar = (layout, props) => {
  const AppCtx = useContext(AppContext)

  return (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: COLORS.secondary }}
    style={{ backgroundColor: "white" }}
    scrollEnabled={true}
    activeColor={COLORS.secondary}
    inactiveColor="grey"
    labelStyle={{ textTransform: "capitalize", fontFamily: "montserrat-17" }}
    onTabPress={({route}) => {
      if (route.title === "Dashboard") {
        // change the active parent panel
        AppCtx.manipulateActiveParentKibandaPanelTab(0)
      }
      else if (route.title === "Orders") {
        AppCtx.manipulateActiveParentKibandaPanelTab(1)
      }
      else if (route.title === "Menus") {
        AppCtx.manipulateActiveParentKibandaPanelTab(2)
      }
    }}
  />
  );
}

const renderScene2 = SceneMap({
  first: CustomerOrders,
  second: CustomerAcceptedOrders,
  third: CustomerCancelledOrders,
  forth: CustomerRejectedOrders,
  fifth: CustomerCompletedOrders,
});

const RenderCustomerOrderTabBar = (layout, props) => {
  const AppCtx = useContext(AppContext);
  const order_id = props.navigationState.order_id;

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.secondary }}
      style={{ backgroundColor: "white" }}
      scrollEnabled={true}
      activeColor={COLORS.secondary}
      onTabPress={({ route }) => {
        if (route.title === "Pending Orders") {
          AppCtx.manipulateActiveCustomerOrderTabNotification(0)
          // hizi ndo zinafanya tab inakuwa refreshed without these it can't on its own after initial refresh
          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Pending Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Accepted Orders") {
          AppCtx.manipulateActiveCustomerOrderTabNotification(1)
          // hizi ndo zinafanya tab inakuwa refreshed without these it can't on its own after initial refresh
          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Accepted Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Cancelled Orders") {
          AppCtx.manipulateActiveCustomerOrderTabNotification(2)
          // hizi ndo zinafanya tab inakuwa refreshed without these it can't on its own after initial refresh
          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Cancelled Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Rejected Orders") {
          AppCtx.manipulateActiveCustomerOrderTabNotification(3)
          // hizi ndo zinafanya tab inakuwa refreshed without these it can't on its own after initial refresh
          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Rejected Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Completed Orders") {
          AppCtx.manipulateActiveCustomerOrderTabNotification(4)
          // hizi ndo zinafanya tab inakuwa refreshed without these it can't on its own after initial refresh
          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Completed Orders",
            shouldRefresh: true,
          });
        }
      }}
      inactiveColor="grey"
      labelStyle={{ textTransform: "capitalize", fontFamily: "montserrat-17" }}
    />
  );
};

const renderScene3 = SceneMap({
  first: PendingOrders,
  second: AcceptedOrders,
  third: CancelledOrders,
  forth: RejectedOrders,
  fifth: CompletedOrders,
});

const RenderKibandaOrderTabBar = (layout, props) => {
  const AppCtx = useContext(AppContext);

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.secondary }}
      style={{ backgroundColor: "white" }}
      scrollEnabled={true}
      activeColor={COLORS.secondary}
      onTabPress={({ route }) => {
        if (route.title === "Pending Orders") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(0)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Pending Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Accepted Orders") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(1)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Accepted Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Cancelled Orders") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(2)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Cancelled Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Rejected Orders") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(3)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Rejected Orders",
            shouldRefresh: true,
          });
        }

        if (route.title === "Completed Orders") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(4)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Completed Orders",
            shouldRefresh: true,
          });
        }
      }}
      inactiveColor="grey"
      labelStyle={{ textTransform: "capitalize", fontFamily: "montserrat-17" }}
    />
  );
};

function KibandaDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} moreData={undefined} />
      )}
    >
      <Drawer.Screen
        options={{
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
        }}
        name="Restaurant"
        component={MyTopTabs}
      />
    </Drawer.Navigator>
  );
}

function MapStack({ navigation }) {
  const AppCtx = useContext(AppContext);

  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack1.Screen name="MapScreen" component={MapScreen} />
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitle:
            AppCtx.clickedKibanda.length > 15
              ? `${AppCtx.clickedKibanda.substr(0, 13)}..`
              : AppCtx.clickedKibanda,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                AppCtx.manipulateShowLoadingSpinner(false);
                AppCtx.manipulateShowLoadingSpinner2(true);
                setTimeout(() => {
                  navigation.navigate("MapScreen");
                }, 50);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
        }}
        name="KibandaDetails2"
        component={KibandaDetailsScreen2}
      />
    </Stack1.Navigator>
  );
}

function NotificationStack({ navigation }) {
  const AppCtx = useContext(AppContext);

  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "left",
          tabBarBadge:
            AppCtx.usernotifications.filter((noti) => !noti.is_read).length < 1
              ? null
              : AppCtx.usernotifications.filter((noti) => !noti.is_read).length,
          headerTitle: "Notification Center",
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                AppCtx.manipulateClearAllNotificationLoading(true);
                try {
                  await clearAllUserNotifications(
                    AppCtx.usermetadata.get_user_id
                  );
                  // update the user notifications
                  AppCtx.updateusernotifications([]);
                } catch (error) {
                }
                AppCtx.manipulateClearAllNotificationLoading(false);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "montserrat-17",
                  marginRight: 10,
                }}
              >
                Clear all
              </Text>
            </TouchableOpacity>
          ),
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        }}
        name="NotificationScreen"
        component={NotificationCenter}
      />
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitle: "Notification",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
        }}
        name="NotificationDetails"
        component={ViewNotification}
      />
    </Stack1.Navigator>
  );
}

function RestaurantStack({ navigation }) {
  const AppCtx = useContext(AppContext);
  {
    /* why i switched to use "Stack" instead of "NativeStack" here because native stack "modal" hide the bottom tabs which
something fixed in "Stack" */
  }
  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack1.Screen name="HomeScreen" component={HomeScreen} />
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitle:
            AppCtx.clickedKibanda.length > 15
              ? `${AppCtx.clickedKibanda.substr(0, 13)}..`
              : AppCtx.clickedKibanda,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                AppCtx.manipulateShowLoadingSpinner(false);
                AppCtx.manipulateShowLoadingSpinner2(true);
                setTimeout(() => {
                  navigation.navigate("HomeScreen");
                }, 50);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
        }}
        name="KibandaDetails"
        component={KibandaDetailsScreen}
      />
      {AppCtx.isAunthenticated && (
        <Stack1.Screen
          options={{
            headerShown: true,
            headerTitle: "Confirm Order",
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "montserrat-17",
            },
            headerStyle: {
              backgroundColor: COLORS.secondary,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 10,
                    fontFamily: "montserrat-17",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
          }}
          name="ConfirmOrder"
          component={ConfirmOrder}
        />
      )}
    </Stack1.Navigator>
  );
}

function SettingStack({ navigation }) {
  const AppCtx = useContext(AppContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Setting" component={SettingScreen} />
      {AppCtx.isAunthenticated && (
        <>
          <Stack.Screen
            name="CompleteKibandaProfile"
            component={CompleteProfile}
          />
          <Stack.Screen name="AddDefaultMeal" component={DefaultMeal} />
          <Stack.Screen
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Available Meal",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitleStyle: {
                fontFamily: "montserrat-17",
              },
              headerTintColor: "#fff",
            }}
            name="AddTodayAvailableMeal"
            component={AddTodayAvailableMeal}
          />
          <Stack.Screen
            options={({ navigation }) => ({
              presentation: "modal",
              headerShown: true,
              headerTitle: "Buy Bundle",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitleStyle: {
                fontFamily: "montserrat-17",
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text
                    title="Cancel"
                    style={{
                      fontFamily: "montserrat-17",
                      color: COLORS.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: "#fff",
            })}
            name="Payment"
            component={Payment}
          />
          <Stack.Screen
            options={({ navigation }) => ({
              presentation: "modal",
              headerShown: true,
              headerTitle: "Default Menu",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitleStyle: {
                fontFamily: "montserrat-17",
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text
                    title="Cancel"
                    style={{
                      fontFamily: "montserrat-17",
                      color: COLORS.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              ),
              headerTintColor: "#fff",
            })}
            name="EditDefaultMenu"
            component={EditKibandaDefaultMenu}
          />
          <Stack.Screen name="KibandaDashboard" component={KibandaDrawer} />
          <Stack.Screen
            name="WaitingVerification"
            component={WaitingAdminVerification}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: "Change Password",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitleStyle: {
                fontFamily: "montserrat-17",
                color: COLORS.primary,
                fontSize: 20,
              },
              headerLeft: () => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (AppCtx.targettedChangePassword === "kibanda") {
                        navigation.navigate("Restaurant");
                      }
                      if (AppCtx.targettedChangePassword === "customer") {
                        navigation.navigate("Setting");
                      }
                    }}
                    style={({ pressed }) =>
                      pressed && { backgroundColor: "grey" }
                    }
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                );
              },
            }}
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitle: "Pin Your Location",
              headerTitleStyle: {
                fontFamily: "montserrat-17",
                color: COLORS.primary,
                fontSize: 20,
              },
              headerLeft: () => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                    style={({ pressed }) =>
                      pressed && { backgroundColor: "grey" }
                    }
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                );
              },
            }}
            name="PickLocationScreen"
            component={MapViewScreen}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: "My Orders",
              headerTitleStyle: {
                fontFamily: "montserrat-17",
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Setting")}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              ),
            }}
            name="MtejaOrders"
            component={CustomerOrderTopTabs}
          />

          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: "View and Edit Profile",
              headerTitleStyle: {
                fontFamily: "montserrat-17",
                color: "#fff",
              },
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.secondary,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("KibandaDashboard")}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              ),
            }}
            name="EditProfileKibanda"
            component={EditKibandaProfileScreen}
          />
        </>
      )}
      {/* if user is already registered don't show this data.. humu ndo kuna kila kitu */}
      {!AppCtx.isAunthenticated && (
        <>
          {/* nimetest ku-navigate kwenye Settings imekubali au inakataa coz hizi 
        screen zipo ndani ya setting/baada ya setting */}
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="VerifyOTPScreen" component={EnterOTPScreen} />
          <Stack.Screen name="SetPinScreen" component={SetLoginPin} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

function MyTabs() {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);
  useEffect(() => {
    {
      /* for ios we need to ask for permission to display notification
     by default in android notification is "granted" so it will not
     ask for permission
     we can't navigate in context.js since it's not a screen component
     that's why we put this code here so as when user receive notification
     and clicked it he should be navigating somewhere, we can do that in
     context.js but we can't navigate from there
     I THINK HERE WE ARE IN GOOD POSITION SINCE OUR APP MAINLY DEPENDS ON
     TABS WHICH HAVE STACKS.. AND WHY IM SAYING THIS IS BECAUSE THIS KIND
     OF LISTENERS WE SHOULD PUT THEM IN HIGHEST COMPONENT WHICH IS APP.JS
     BUT IN MY CASE IT FAILS TO WORK IN APP.JS RETURN STATEMENT WHICH MAKE
     ME PUT IN TABS INSTEAD, AND IT FAILS IN RETURN OF APP.JS BECAUSE OF THE
     NAVIGATION
      */
    }
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Allow this app to send you notifications");
          return;
        }
      }
    })();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
      }
    );

    // means the user responded to notification by clicking/tapping on it
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // LOGIC OF PLACED ORDER FOR BOTH CUSTOMER AND KIBANDA
        if (response.notification.request.content.title === "Order Placed") {
          // i think we should refresh the "order" tab..
          // it should feel like order tab have been clicked
          // lets set it to zero since order is placed... im in the customer order
          AppCtx.manipulateActiveCustomerOrderTabNotification(0)

          AppCtx.manipulateActiveCustomerOrderMetadata({
            tab: "Pending Orders",
            shouldRefresh: true,
          });
          navigation.navigate("Settings", {
            screen: "MtejaOrders",
          });
        }
        if (response.notification.request.content.title === "New Order") {
          AppCtx.manipulateActiveKibandaOrderTabNotification(0)
          AppCtx.manipulateActiveKibandaOrderMetadata({
            tab: "Pending Orders",
            shouldRefresh: true
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
        // END OF LOGIC OF PLACED ORDER FOR BOTH CUSTOMER AND KIBANDA

        // LOGIC OF CANCELLED ORDER FOR BOTH KIBANDA AND CUSTOMER
        if (response.notification.request.content.body === "Customer have cancelled the order made") {
          // we're dealing with kibanda
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
        }

        // NO NOTIFICATION GET SENT FOR CUSTOMER IF HE CANCEL THE ORDER..
        // END OF LOGIC OF CANCELLED ORDER FOR BOTH KIBANDA AND CUSTOMER

        // LOGIC OF ACCEPTED ORDER FOR BOTH KIBANDA AND CUSTOMER
        if (response.notification.request.content.body.toLowerCase().includes("Your order has been accepted".toLowerCase())) {
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

        if (response.notification.request.content.body.toLowerCase().includes("Order marked accepted successful".toLowerCase())) {
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

        // END OF LOGIC FOR ACCEPTED ORDER FOR BOTH CUSTOMER AND KIBANDA..

        // LOGIC FOR COMPLETED ORDER FOR BOTH CUSTOMER AND KIBANDA
        if (response.notification.request.content.body.toLowerCase().includes("Your order has been completed".toLowerCase())) {
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

        if (response.notification.request.content.body.toLowerCase().includes("Order marked completed successful".toLowerCase())) {
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
        }

        // THE END OF LOGIC FOR COMPLETED ORDERS FOR BOTH CUSTOMER AND KIBANDA

        // REJECTED ORDERS HANDLER FOR BOTH CUSTOMER AND KIBANDA
        if (response.notification.request.content.body === "Your order has been rejected") {
          // we're dealing with the customer...
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
        }

        if (response.notification.request.content.title === "Successful Rejected") {
          // we're dealing with kibanda who reject the order
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

        // END OF LOGIC FOR REJECTED ORDER FOR BOTH CUSTOMER AND KIBANDA


        if (
          response.notification.request.content.title === "Account Activated"
        ) {
          navigation.navigate("Settings", {
            screen: "AddDefaultMeal",
          });
        }

        if (response.notification.request.content.title === "Account Deactivated") {
          navigation.navigate("Settings", {
            screen: "WaitingVerification"
          })
        }
      }
    );

    return () => {
      // we need to remove listener when component is unmounted
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DBB42C",
      }}
    >
      <Tab.Screen
        options={{
          title: "Restaurants",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="restaurant"
              focused={focused}
            />
          ),
        }}
        name="Home"
        component={RestaurantStack}
      />

      <Tab.Screen
        options={{
          title: "Notifications",
          tabBarBadge:
            AppCtx.usernotifications.filter((noti) => !noti.is_read).length < 1
              ? null
              : AppCtx.usernotifications.filter((noti) => !noti.is_read).length,
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="notifications"
              focused={focused}
            />
          ),
        }}
        name="Notifications"
        component={NotificationStack}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon size={size} color={color} name="map" focused={focused} />
          ),
        }}
        name="Map"
        component={MapStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="settings"
              focused={focused}
            />
          ),
        }}
        name="Settings"
        component={SettingStack}
      />
    </Tab.Navigator>
  );
}

// https://github.com/satya164/react-native-tab-view
function CustomerOrderTopTabs({ route }) {
  const jumpto = route.params?.jumpto;
  const order_id = route.params?.order_id;
  // BUT HOW WE CAN PASS THIS DOWN TO THE GIVEN TABS..
  const AppCtx = useContext(AppContext);

  let initialScreen = 0;
  if (jumpto && jumpto.toLowerCase() === "completed".toLowerCase()) {
    initialScreen = 4;
  }

  if (jumpto && jumpto.toLowerCase() === "rejected".toLowerCase()) {
    initialScreen = 3;
  }

  if (jumpto && jumpto.toLowerCase() === "cancelled".toLowerCase()) {
    initialScreen = 2;
  }

  if (jumpto && jumpto.toLowerCase() === "accepted".toLowerCase()) {
    initialScreen = 1;
  }

  const layout = useWindowDimensions();
  // this is how you decide which tab to be used as initial screen,
  // all params sent are received in this component
  const [index, setIndex] = useState(initialScreen);
  const [routes] = useState([
    { key: "first", title: "Pending Orders" },
    { key: "second", title: "Accepted Orders" },
    { key: "third", title: "Cancelled Orders" },
    { key: "forth", title: "Rejected Orders" },
    { key: "fifth", title: "Completed Orders" },
  ]);

  // uchawi upo kwenye hii index i think ndo inayoamua active tab iwe ipi according to chatgpt
  return (
    <>
      <StatusBar style="dark" />
      <TabView
        swipeEnabled={false}
        lazy
        renderTabBar={RenderCustomerOrderTabBar.bind(this, layout)}
        navigationState={{ index: AppCtx.activeCustomerOrderTabNotification, routes, order_id }}
        renderScene={renderScene2}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

// when i say rejected order are order which "customer" cancelled
function KibandaOrderTopTabs({ route }) {
  const jumpto = route.params ? route.params.jumpto : undefined;
  const order_id = route.params?.order_id;
  const AppCtx = useContext(AppContext);

  let initialScreen = 0;
  if (jumpto && jumpto.toLowerCase() === "completed".toLowerCase()) {
    initialScreen = 2;
  }

  if (jumpto && jumpto.toLowerCase() === "rejected".toLowerCase()) {
    initialScreen = 3;
  }

  if (jumpto && jumpto.toLowerCase() === "cancelled".toLowerCase()) {
    initialScreen = 2;
  }

  if (jumpto && jumpto.toLowerCase() === "accepted".toLowerCase()) {
    initialScreen = 1;
  }

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(initialScreen);
  const [routes] = useState([
    { key: "first", title: "Pending Orders" },
    { key: "second", title: "Accepted Orders" },
    { key: "third", title: "Cancelled Orders" },
    { key: "forth", title: "Rejected Orders" },
    { key: "fifth", title: "Completed Orders" },
  ]);

  return (
    <>
      <StatusBar style="dark" />
      <TabView
        swipeEnabled={false}
        lazy
        renderTabBar={RenderKibandaOrderTabBar.bind(this, layout)}
        navigationState={{ index: AppCtx.activeKibandaOrderTabNotification, routes }}
        renderScene={renderScene3}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MyTabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const NetworkCheck = ({ status, type }) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.statusText}>
        Connection Status : {status ? "Connected" : "Disconnected"}
      </Text>
      <Text style={styles.statusText}>Connection Type : {type}</Text> */}
      <Animation
        style={{
          width: 220,
          alignSelf: "center",
          aspectRatio: 1,
        }}
        source={require("./assets/LottieAnimations/animation_lkffzc96.json")}
      />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "overpass-reg": require("./assets/fonts/personalyzer/Overpass-Regular.ttf"),
    "roboto-reg": require("./assets/fonts/personalyzer/Roboto-Regular.ttf"),
    "roboto-med": require("./assets/fonts/personalyzer/Roboto-MediumItalic.ttf"),
    "montserrat-1": require("./assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf"),
    "montserrat-2": require("./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"),
    "montserrat-3": require("./assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
    "montserrat-4": require("./assets/fonts/Montserrat/static/Montserrat-BlackItalic.ttf"),
    "montserrat-5": require("./assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    "montserrat-6": require("./assets/fonts/Montserrat/static/Montserrat-BoldItalic.ttf"),
    "montserrat-7": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf"),
    "montserrat-8": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBoldItalic.ttf"),
    "montserrat-9": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf"),
    "montserrat-10": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLightItalic.ttf"),
    "montserrat-11": require("./assets/fonts/Montserrat/static/Montserrat-Italic.ttf"),
    "montserrat-12": require("./assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    "montserrat-13": require("./assets/fonts/Montserrat/static/Montserrat-LightItalic.ttf"),
    "montserrat-14": require("./assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    "montserrat-15": require("./assets/fonts/Montserrat/static/Montserrat-MediumItalic.ttf"),
    "montserrat-16": require("./assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "montserrat-18": require("./assets/fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
    "montserrat-19": require("./assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "montserrat-20": require("./assets/fonts/Montserrat/static/Montserrat-ThinItalic.ttf"),
  });

 

  // CHECKING IF DEVICE IS CONNECTED TO THE NETWORK IF NOT WE DONT RENDER THE APP
  // https://blog.openreplay.com/real-time-network-status-detection-with-react-native/
  const [appIsReady, setAppIsReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const [needupdate, setNeedUpdate] = useState(false)
  const [stillCheckingVerion, setStillCheckingVersion] = useState(true)
  const [updateMetadata, setUpdateMetadata] = useState()

  const checkVersion = async () => {
    setStillCheckingVersion(true)
    let updateNeeded = await VersionCheck.needUpdate();
    setUpdateMetadata(updateNeeded)
    try {
      if (updateNeeded && updateNeeded.isNeeded) {
        setNeedUpdate(true)
        setStillCheckingVersion(false)
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using.',
          [
            {
              text: "Update",
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {
            cancelable: false
          },
        );
      }
      else {
        setNeedUpdate(false)
        setStillCheckingVersion(false)
      }
    } catch(error) {
      setStillCheckingVersion(false)
    }
  } 

  useEffect(() => {
    checkVersion();
  }, [])

  useEffect(() => {
    const loadResources = async () => {
      await _cacheResourcesAsync();
      setAppIsReady(true);
    };
    loadResources();
  }, []);

  // This callback function will be fired whenever there’s a network change
  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  const handleNetworkChange = (state) => {
    setConnectionStatus(state.isConnected);
    setConnectionType(state.type);
  };

  if (!appIsReady || !fontsLoaded || stillCheckingVerion) {
    return <LoadingSpinner />;
  }

  // should be (needupdate)
  if (needupdate) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Animation
          style={{
            width: 220,
            alignSelf: "center",
            aspectRatio: 1,
          }}
          source={require("./assets/LottieAnimations/animation_ll5necmh.json")}
        />
        <View style={{marginTop: "4%"}}>
        <Button
          mode="contained"
          style={{
            backgroundColor: COLORS.secondary,
            marginTop: "5%",
            borderRadius: 30,
          }}
          labelStyle={{
            fontFamily: "montserrat-17",
            fontSize: 16,
            color: COLORS.primary,
          }}
          onPress={() => {
            BackHandler.exitApp();
            updateMetadata && Linking.openURL(updateMetadata.storeUrl);
          }}
        >
          Update Now
        </Button>
        </View>
      </View>
    )
  }

  {/* in order to have the ability to drag up down the bottom sheet it we must wrap full component using the 
      GestureHandlerRootView you can do that here or if you want all component to mutate the same prop you can
      wrap full App.js root component with GestureHandlerRootView so as to have the gesture in all component for
      me let me do it here, the documentation of the "BottomSheet" forgot to tell us about this issue
      for now thank you github issues solved this
      I don't know why the BottomSheet at Map.js worked without wrapping with this <GestureHandlerRootView> 
      but i think it because of Map has drag and other gestures enabled... BUT I THINK ITS BETTER APPROACH TO WRAP
      THIS <GestureHandlerRootView /> in our App.js to avoid wrapping everytime to the component we want to have the 
      gesture events... so i'm going to wrap in App.js
      https://github.com/gorhom/react-native-bottom-sheet/issues/800
  */}
  return (
    <GestureHandlerRootView style={{
      flex: 1
    }}>
      <StatusBar style="dark" />
      {connectionStatus ? (
        <AppContextProvider>
          <Navigation />
        </AppContextProvider>
      ) : (
        <NetworkCheck status={connectionStatus} type={connectionType} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  statusText: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
  },
});
