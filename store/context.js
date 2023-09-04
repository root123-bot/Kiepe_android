/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-lone-blocks */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../constants/domain";
import React from "react";
import {
  fetchCustomerOrders,
  fetchKibandaOrders,
  saveDeviceNotificationToken,
  userNotifications,
} from "../utils/requests";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// user_metadata should hold the "user_id", "is_authenticated"
export const AppContext = createContext({
  isAunthenticated: false,
  usermetadata: {},
  lastLoginPhoneNumber: null,
  stillExecutingUserMetadata: true,
  appReady: false,
  registermetadata: {},
  alreadyValidated: false,
  initialCoords: null,
  beforeAddLocationData: {},
  menuAddedByAdministratorForRestaurantsToChoose: {},
  defaultKibandaMenu: {},
  todayKibandaAvailableMenu: {},
  pushToken: null,
  favoriteVibanda: [],
  availableVibanda: [],
  initialKibandaStatus: null,
  isLoadingAvailableMenu: false,
  fetchAgainAvailableMenu: false,
  toggleFavorite: false,
  isUpdatingAvailableMenu: false,
  cart: [],
  afterLoginNext: [],
  clickedKibanda: "",
  customerOrders: [],  // remove undefined for now
  activeCustomerOrderMetadata: { tab: "", shouldRefresh: false },
  activeKibandaOrderMetadata: { tab: "", shouldRefresh: false },
  activeCustomerOrderTabNotification: 0,
  activeKibandaOrderTabNotification: 0,
  activeParentKibandaPanelTab: 0,
  kibandaOrders: [], // let me put undefined to detect if sht was fetched
  usernotifications: [],
  clearAllNotificationLoading: false,
  targettedChangePassword: null,
  defaultFilter: "all",
  showLoadingSpinner: false,
  showLoadingSpinner2: false,
  resetPhoneNumber: {},
  isDefaultMenuSetOnOpen: false,
  toggleStatus: undefined,
  favIcon: "heart-outline",
  addinitialCoords: (coords) => {},
  manipulateIsAunthenticated: (status) => {},
  manipulateUserMetadata: (metadata) => {},
  manipulateAlreadyValidated: (status) => {},
  addRegisterMetadata: (metadata) => {},
  clearRegisterMetadata: () => {},
  logout: () => {},
  manipulateLastLoginPhoneNumber: (phone_number) => {},
  manipulateBeforeAddingLocationData: (metadata) => {},
  manipulateDefaultKibandaMenu: (metadata) => {},
  manipulateTodayKibandaAvailableMenu: (metadata) => {},
  manipulatePushToken: (token) => {},
  manipulateFavoriteVibanda: (vibanda) => {},
  manipulateAvailableVibanda: (vibanda) => {},
  manipulateInitialKibandaStatus: (status) => {},
  manipulateIsLoadingAvailableMenu: (metadata) => {},
  manipulateFetchAgainAvailableMenu: (flag) => {},
  manipulateToggleFavorite: (status) => {},
  manipulateIsUpdatingAvailableMenu: (status) => {},
  manipulateCart: (metadata) => {},
  manipulateAfterLoginNext: (next) => {},
  manipulateClickedKibanda: (brandname) => {},
  manipulateCustomerOrders: (order) => {},
  updateCustomerOrdersMetadata: (orders) => {},
  markOrderCancelled: (order_id) => {},
  markOrderDeleted: (order_id) => {},
  manipulateActiveCustomerOrderMetadata: (metadata) => {},
  manipulateActiveKibandaOrderMetadata: (metadata) => {},
  manipulateKibandaOrders: (order) => {},
  updateKibandaOrdersMetadata: (orders) => {},
  updateusernotifications: (notifications) => {},
  manipulateusernotification: (notification) => {},
  markNotificationAsRead: (notification_id) => {},
  manipulateClearAllNotificationLoading: (status) => {},
  manipulateTargettedChangePassword: (status) => {},
  manipulateActiveFilter: (filter) => {},
  manipulateShowLoadingSpinner: (status) => {},
  manipulateShowLoadingSpinner2: (status) => {},
  manipulateResetPhoneNumber: (metadata) => {},
  manipulateIsDefaultMenuSetOnOpen: (status) => {},
  manipulateToggleStatus: (status) => {},
  manipulateActiveCustomerOrderTabNotification: (status) => {},
  manipulateActiveKibandaOrderTabNotification: (status) => {},
  manipulateActiveParentKibandaPanelTab: (status) => {},
  manipulateFavIcon: (icon) => {}
});

function AppContextProvider({ children }) {
  const [usermetadata, setUserMetadata] = useState();
  const [stillExecutingUserMetadata, setStillExecutingUserMetadata] =
    useState(true);
  const [lastLoginPhoneNumber, setLastLoginPhoneNumber] = useState(null);
  const [isAunthenticated, setIsAunthenticated] = useState(false);
  const [registermetadata, setRegisterMetadata] = useState({});
  const [alreadyValidated, setAlreadyValidated] = useState(false);
  const [initialCoords, setInitialCoords] = useState();
  const [pushToken, setPushToken] = useState(null);
  const [favoriteVibanda, setFavoriteVibanda] = useState([]);
  const [beforeAddLocationData, setBeforeAddLocationData] = useState({});
  const [availableVibanda, setAvailableVibanda] = useState([]);
  const [isLoadingAvailableMenu, setIsLoadingAvailableMenu] = useState(false);
  const [fetchAgainAvailableMenu, setFetchAgainAvailableMenu] = useState(false);
  const [initialKibandaStatus, setInitialKibandaStatus] = useState(null);
  const [toggleFavorite, setToggleFavorite] = useState(false);
  const [isUpdatingAvailableMenu, setIsUpdatingAvailableMenu] = useState(false);
  const [cart, setCart] = useState([]);
  const [toggleStatus, setToggleStatus] = useState(undefined);
  const [isDefaultMenuSetOnOpen, setIsDefaultMenuSetOnOpen] = useState(false);
  const [resetPhoneNumber, setResetPhoneNumber] = useState({});
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [showLoadingSpinner2, setShowLoadingSpinner2] = useState(false);
  const [afterLoginNext, setAfterLoginNext] = useState();
  const [customerOrders, setCustomerOrders] = useState([]);
  const [usernotifications, setUserNotifications] = useState([]);
  const [targettedChangePassword, setTargettedChangePassword] = useState(null);
  const [activeCustomerOrderTabNotification, setActiveCustomerOrderTabNotification] = useState(0)
  const [activeKibandaOrderTabNotification, setActiveKibandaOrderTabNotification] = useState(0)
  const [activeParentKibandaPanelTab, setActiveParentKibandaPanelTab] = useState(0)
  const [activeFilter, setActiveFilter] = useState("all");
  const [favIcon, setFavIcon] = useState("heart-outline")
  const [clearAllNotificationLoading, setClearAllNotificationLoading] =
    useState(false);
  const [activeCustomerOrderMetadata, setActiveCustomerOrderMetadata] =
    useState({ tab: "", shouldRefresh: false });
  const [activeKibandaOrderMetadata, setActiveKibandaOrderMetadata] = useState({
    tab: "",
    shouldRefresh: false,
  });
  const [clickedKibanda, setClickedKibanda] = useState("");
  const [kibandaOrders, setKibandaOrders] = useState([]);
  const [
    menuAddedByAdministratorForRestaurantsToChoose,
    setMenuAddedByAdministratorForRestaurantsToChoose,
  ] = useState({});
  const [defaultKibandaMenu, setDefaultKibandaMenu] = useState({});
  const [todayKibandaAvailableMenu, setTodayKibandaAvailableMenu] = useState(
    {}
  );

  function manipulateActiveCustomerOrderTabNotification(status) {
    setActiveCustomerOrderTabNotification(status)
  }

  function manipulateActiveKibandaOrderTabNotification(status) {
    setActiveKibandaOrderTabNotification(status)
  }

  function manipulateActiveParentKibandaPanelTab(status) {
    setActiveParentKibandaPanelTab(status)
  }

  function manipulateResetPhoneNumber(metadata) {
    setResetPhoneNumber((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function manipulateToggleStatus(status) {
    setToggleStatus(status);
  }

  function manipulateTargettedChangePassword(status) {
    setTargettedChangePassword(status);
  }

  function manipulateActiveCustomerOrderMetadata(metadata) {
    setActiveCustomerOrderMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function manipulateShowLoadingSpinner(status) {
    setShowLoadingSpinner(status);
  }

  function manipulateIsDefaultMenuSetOnOpen(status) {
    setIsDefaultMenuSetOnOpen(status);
  }

  function manipulateFavIcon(icon) {
    setFavIcon(icon)
  }

  function manipulateShowLoadingSpinner2(status) {
    setShowLoadingSpinner2(status);
  }

  function manipulateActiveFilter(filter) {
    setActiveFilter(filter);
  }

  function markNotificationAsRead(notification_id) {
    setUserNotifications((prevState) => {
      const notifications = [...prevState];
      const target = notifications.find(
        (notification) => +notification.id === +notification_id
      );
      if (target) {
        target.is_read = true;
      }
      return notifications;
    });
  }

  function updateusernotifications(notifications) {
    setUserNotifications(notifications);
  }

  function manipulateActiveKibandaOrderMetadata(metadata) {
    setActiveKibandaOrderMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function manipulateClearAllNotificationLoading(status) {
    setClearAllNotificationLoading(status);
  }

  function manipulateusernotification(notification) {
    setUserNotifications((prevState) => {
      const notifications = [...prevState];
      const target = notifications
        .filter((notification) => notification.is_read === false)
        .find((noti) => +noti.id === +notification.id);
      if (target) {
        const targetIndex = notifications.findIndex(
          (noti) => +noti.id === +notification.id
        );
        notifications.splice(targetIndex, 1);
        // i post my new notifcation to array
        notifications.push(notification);
      } else {
        notifications.push(notification);
      }

      return notifications;
    });
  }

  function manipulateUserMetadata(metadata) {
    setUserMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function markOrderCancelled(order_id) {
    setCustomerOrders((prevState) => {
      const orders = [...prevState];
      const target = orders.find((order) => +order.order_id === +order_id);
      const targetIndex = orders.findIndex(
        (order) => +order.order_id === +order_id
      );
      if (target) {
        const modified_order = { ...orders, order_status: "cancelled" };
        orders.splice(targetIndex, 1);
        orders.push(modified_order);
      }

      return orders;
    });
  }

  function markOrderDeleted(order_id) {
    setCustomerOrders((prevState) => {
      const orders = [...prevState];
      const target = orders.find((order) => +order.order_id === +order_id);
      const targetIndex = orders.findIndex(
        (order) => +order.order_id === +order_id
      );
      if (target) {
        const modified_order = { ...orders, mark_as_deleted: true };
        orders.splice(targetIndex, 1);
        orders.push(modified_order);
      }

      return orders;
    });
  }

  function manipulateCustomerOrders(order) {
    // check if incoming order is already in the list by referencing its id
    setCustomerOrders((prevState) => {
      const orders = [...prevState];
      let finalResult = orders.filter(
        (item) => +item.order_id !== +order.order_id
      );
      finalResult.push(order);
      return finalResult;
    });
  }

  function manipulateKibandaOrders(order) {
    setKibandaOrders((prevState) => {
      const orders = [...prevState];
      let finalResult = orders.filter(
        (item) => +item.order_id !== +order.order_id
      );
      finalResult.push(order);
      return finalResult;
    });
  }

  function manipulateClickedKibanda(brandname) {
    setClickedKibanda(brandname);
  }

  function manipulateAfterLoginNext(next) {
    setAfterLoginNext(next);
  }

  function updateCustomerOrdersMetadata(orders) {
    setCustomerOrders(orders);
  }

  function updateKibandaOrdersMetadata(orders) {
    setKibandaOrders(orders);
  }

  function manipulateCart(metadata) {
    // check if cart of that id exist if exist we should remove it
    // if not exist we should add it
    const { kibandaId } = metadata;
    setCart((prevState) => {
      const cart = [...prevState];
      let finalResult = cart.filter((item) => +item.kibandaId !== +kibandaId);
      finalResult.push(metadata);
      return finalResult;
    });
  }

  function manipulateIsUpdatingAvailableMenu(status) {
    setIsUpdatingAvailableMenu(status);
  }

  function manipulateIsLoadingAvailableMenu(status) {
    setIsLoadingAvailableMenu(status);
  }

  function manipulateFetchAgainAvailableMenu(flag) {
    setFetchAgainAvailableMenu(flag);
  }

  function manipulateInitialKibandaStatus(status) {
    setInitialKibandaStatus(status);
  }

  function manipulateToggleFavorite(status) {
    setToggleFavorite(status);
  }

  function manipulatePushToken(token) {
    setPushToken(token);
  }

  function manipulateAvailableVibanda(vibanda) {
    setAvailableVibanda(vibanda);
  }

  function manipulateLastLoginPhoneNumber(phone_number) {
    setLastLoginPhoneNumber(phone_number);
  }

  function manipulateDefaultKibandaMenu(metadata) {
    setDefaultKibandaMenu((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  async function manipulateFavoriteVibanda(metadata) {
    if (metadata.status === "add") {
      setFavoriteVibanda((prevState) => {
        return [...prevState, metadata.user_id];
      });
      let favorites = await AsyncStorage.getItem("favorite_vibanda");
      if (!favorites) {
        favorites = JSON.stringify([]);
      }
      favorites = JSON.parse(favorites);
      favorites.push(+metadata.user_id);
      await AsyncStorage.setItem("favorite_vibanda", JSON.stringify(favorites));
    }

    if (metadata.status === "remove") {
      setFavoriteVibanda((prevState) => {
        return prevState.filter((item) => +item !== +metadata.user_id);
      });
      let favorites = await AsyncStorage.getItem("favorite_vibanda");
      if (!favorites) {
        favorites = JSON.stringify([]);
      }
      favorites = JSON.parse(favorites);
      favorites = favorites.filter((item) => +item !== +metadata.user_id);
      await AsyncStorage.setItem("favorite_vibanda", JSON.stringify(favorites));
    }
  }

  function manipulateBeforeAddingLocationData(metadata) {
    setBeforeAddLocationData((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function manipulateIsAunthenticated(status) {
    setIsAunthenticated(status);
  }

  function addinitialCoords(coords) {
    setInitialCoords(coords);
  }

  function manipulateAlreadyValidated(status) {
    setAlreadyValidated(status);
  }

  function addRegisterMetadata(metadata) {
    setRegisterMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  // make sure you clear all states to its default on logout
  function logout() {
    setUserNotifications([]);

    setToggleStatus(false);
    setTodayKibandaAvailableMenu({});
    setIsDefaultMenuSetOnOpen(false);
    setIsLoadingAvailableMenu(false);

    setRegisterMetadata({});
    setAlreadyValidated(false);
    setInitialCoords();
    setBeforeAddLocationData({});
    setFetchAgainAvailableMenu(false);
    setInitialKibandaStatus(false);
    setToggleFavorite(false);
    setIsUpdatingAvailableMenu(false);
    // setCart([]);
    setToggleStatus(undefined);
    setIsDefaultMenuSetOnOpen(false);
    setResetPhoneNumber({});
    setShowLoadingSpinner(false);
    setShowLoadingSpinner2(false);
    setAfterLoginNext();
    setUserNotifications([]);
    setTargettedChangePassword(null);
    setClearAllNotificationLoading(false);
    setActiveCustomerOrderMetadata({ tab: "", shouldRefresh: false });
    setActiveKibandaOrderMetadata({
      tab: "",
      shouldRefresh: false,
    });
    setKibandaOrders([]); // we should set [] instead  of "undefined" if we set undefined when user login again it will show spinner even if we have the orders fetched
    setDefaultKibandaMenu({});
    setTodayKibandaAvailableMenu({});

    setToggleFavorite(false);
    setIsAunthenticated(false);
    setUserMetadata({});
    setRegisterMetadata({});
    setDefaultKibandaMenu({});
    setAlreadyValidated(false);
    setAfterLoginNext();
    setCustomerOrders([]); // we should set [] instead  of "undefined" if we set undefined when user login again it will show spinner even if we have the orders fetched
    AsyncStorage.removeItem("user_id");
  }

  function clearRegisterMetadata() {
    setRegisterMetadata({});
  }

  function fetchOtherRequiredMetadata() {
    fetch(`${BASE_URL}/api/menuaddedbyadministrator/`)
      .then((response) => response.json())
      .then((data) => {
        setMenuAddedByAdministratorForRestaurantsToChoose(data);
      })
      .catch((error) =>
        console.log("failed to fetch menu added by administrator ", error)
      );
  }

  function manipulateTodayKibandaAvailableMenu(metadata) {
    setTodayKibandaAvailableMenu((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function fetchAvailableCart() {
    AsyncStorage.getItem("cart")
      .then((cart) => {
        if (!cart) {
          cart = JSON.stringify([]);
        }
        cart = JSON.parse(cart);
        setCart(cart);
      })
      .catch((error) => console.log("failed to fetch cart ", error));
  }

  async function fetchFavoriteVibanda() {
    let favorites = await AsyncStorage.getItem("favorite_vibanda");
    if (!favorites) {
      favorites = JSON.stringify([]);
    }
    favorites = JSON.parse(favorites);
    setFavoriteVibanda(favorites);
  }

  // this is called before it should logout the user is it detect he's not registered
  async function executeUserMetadata() {
    let user_id = await AsyncStorage.getItem("user_id");
    let phone_number = await AsyncStorage.getItem("phone_number");
    setLastLoginPhoneNumber(phone_number);

    if (user_id) {
      try {
        const orders = await fetchCustomerOrders(user_id);
        setCustomerOrders(orders);
      } catch (error) {
      }

      // fetch user notifications
      try {
        const notifications = await userNotifications(user_id);
        setUserNotifications(notifications);
      } catch (error) {
      }
      // kama kuna user_id in local storage then the user is aunthenticated...
      // lets also post the pushToken and user_id to the backend...
      setIsAunthenticated(true);
      // fetch from userdetails
      fetch(`${BASE_URL}/api/userdetails/`, {
        method: "POST",
        body: JSON.stringify({
          user_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            console.log("IM IN THIS BUG")
            // that's user has no usergroup you should do all required process here......
            // you can throw the error but this will stop the exection of other api inside while
            // we only need to delete his account and log him out...
            // but i think we should throw the error coz inner api it fetch kibandadefault menu
            // and other things which will not be valid for "unrecongnized user"
            if (response.status === 404) {
              throw new Error(`Unrecognized user group ${user_id}`)
            }
            // we should know what kind of error..
            response.json().then(data => {
              throw new Error(data.details)
            })
            // throw new Error("Internal server error ");
          }
          // console.log("IM OUTSIDE")
          return response.json()
        })
        .then(async (data) => {
          // console.log("CONTINUE WHAT UR DOING")
          setUserMetadata(data);
          if (data.usergroup.toLowerCase() === "kibanda") {
            try {
              const orders = await fetchKibandaOrders(user_id);
              setKibandaOrders(orders);
            } catch (error) {
            }

            fetch(`${BASE_URL}/api/getdefaultkibandamenu/`, {
              method: "POST",
              body: JSON.stringify({
                user_id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("failed to fetch default kibanda menu");
              })
              .then((output) => {
                setDefaultKibandaMenu(output);
                // setStillExecutingUserMetadata(false);
              })
              .catch((error) => {
                // error we expect is user does not have a default menu
                // setStillExecutingUserMetadata(false);
              });
          }
        })
        .catch((err) => {
          if (err.message.toLowerCase().includes("Unrecognized user".toLowerCase())) {
            // delete that user... i don't care about the result...

            const splitted = err.message.split(" ")
            const user_id = splitted[splitted.length - 1]
            fetch(`${BASE_URL}/api/delete_user/`, {
              method: "POST",
              body: JSON.stringify({
                user_id
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(response => response.json()).then(data => console.log("THIS IS RESOLVED RESPONSE ", data)).catch(err => console.log("THIS IS ERROR MESSAGE ", err.message))
            console.log('I SHOULD LOGOUT THE USER')
            logout();
            setStillExecutingUserMetadata(false)
          }
          else {
            console.log("Whats happened ", err.message)
            // in most case we have "CustomUser matching query does not exist for that case i think we should logout. and delete stored userid"
            // THIS IS BECAUSE THE USER GROUP IS NOT RECOGNIZED.. SHOULD WE AVOID THAT USER? JUST DELETE EM OR WE SHOULD LEAVE IT
            logout()
            // no need to alert the user about what happend on the backgound just logout out.. and as you know we'll have the spinner until this request get
            // completed....
            setStillExecutingUserMetadata(false)
          }
        });
    } else {
      setStillExecutingUserMetadata(false);
      // also you
    }
  }

  useEffect(() => {
    if (usermetadata) {
      setStillExecutingUserMetadata(false);
    }
  }, [usermetadata]);
  // 880007
  useEffect(() => {
    // logout();
    executeUserMetadata();
    fetchOtherRequiredMetadata();
    fetchFavoriteVibanda();
    fetchAvailableCart();
  }, []);

  const value = {
    isAunthenticated,
    usermetadata,
    stillExecutingUserMetadata,
    registermetadata,
    alreadyValidated,
    initialCoords,
    lastLoginPhoneNumber,
    beforeAddLocationData,
    menuAddedByAdministratorForRestaurantsToChoose,
    defaultKibandaMenu,
    todayKibandaAvailableMenu,
    pushToken,
    favoriteVibanda,
    availableVibanda,
    initialKibandaStatus,
    isLoadingAvailableMenu,
    fetchAgainAvailableMenu,
    toggleFavorite,
    isUpdatingAvailableMenu,
    cart,
    afterLoginNext,
    clickedKibanda,
    customerOrders,
    activeCustomerOrderMetadata,
    activeKibandaOrderMetadata,
    kibandaOrders,
    usernotifications,
    clearAllNotificationLoading,
    targettedChangePassword,
    activeFilter,
    showLoadingSpinner,
    showLoadingSpinner2,
    resetPhoneNumber,
    isDefaultMenuSetOnOpen,
    toggleStatus,
    activeCustomerOrderTabNotification,
    activeKibandaOrderTabNotification,
    activeParentKibandaPanelTab,
    favIcon,
    manipulateUserMetadata,
    addRegisterMetadata,
    clearRegisterMetadata,
    manipulateAlreadyValidated,
    manipulateIsAunthenticated,
    logout,
    addinitialCoords,
    manipulateLastLoginPhoneNumber,
    manipulateBeforeAddingLocationData,
    manipulateDefaultKibandaMenu,
    manipulateTodayKibandaAvailableMenu,
    manipulatePushToken,
    manipulateFavoriteVibanda,
    manipulateAvailableVibanda,
    manipulateInitialKibandaStatus,
    manipulateIsLoadingAvailableMenu,
    manipulateFetchAgainAvailableMenu,
    manipulateToggleFavorite,
    manipulateIsUpdatingAvailableMenu,
    manipulateCart,
    manipulateAfterLoginNext,
    manipulateClickedKibanda,
    manipulateCustomerOrders,
    updateCustomerOrdersMetadata,
    markOrderCancelled,
    markOrderDeleted,
    manipulateActiveCustomerOrderMetadata,
    manipulateActiveKibandaOrderMetadata,
    manipulateKibandaOrders,
    updateKibandaOrdersMetadata,
    updateusernotifications,
    manipulateusernotification,
    markNotificationAsRead,
    manipulateClearAllNotificationLoading,
    manipulateTargettedChangePassword,
    manipulateActiveFilter,
    manipulateShowLoadingSpinner,
    manipulateShowLoadingSpinner2,
    manipulateResetPhoneNumber,
    manipulateIsDefaultMenuSetOnOpen,
    manipulateToggleStatus,
    manipulateActiveCustomerOrderTabNotification,
    manipulateActiveKibandaOrderTabNotification,
    manipulateActiveParentKibandaPanelTab,
    manipulateFavIcon
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
