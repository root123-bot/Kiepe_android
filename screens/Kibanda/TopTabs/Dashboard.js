/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, {
  memo,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LinearGradient,
  ScrollView,
  Alert,
} from "react-native";
import DashboardCard from "../../../components/Kibanda/DashboardCard";
import Background from "../../../components/UI/Background";
import { COLORS } from "../../../constants/colors";

import BigCard from "../../../components/Kibanda/BigCard";
import { AppContext } from "../../../store/context";
import {
  checkIfTodayAvailableMenuSet,
  getKibandaDefaultMenu,
  KibandaTodayAvailableMenu,
  pureKibandaAvailableMenuNoAutoAddDefaultMenu,
  updateKibandaStatus,
  useDefaultMenuAsTodayMenu,
  manipulateTodayAvailableMenuItem,
  userdetails,
} from "../../../utils/requests";
import { CustomizedLottieMessage2 } from "../../../components/UI/Message";
import { useNavigation } from "@react-navigation/native";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import * as Notifications from "expo-notifications";
import { BASE_URL } from "../../../constants/domain";
import AvailableMenuCard from "../../../components/Kibanda/AvailableMenuCard";
function DashboardScreen() {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();

  const [availableDefaultMenu, setAvailableDefaultMenu] = useState(null);
  const [isTodayMenuSet, setIsTodayMenuSet] = useState(false);
  const [showSetTodayMenuDialogue, setShowSetTodayMenuDialogue] = useState(0);
  const [loadAvailableMenu, setLoadAvailableMenu] = useState(false);
  const [toggleStatus, setToggleStatus] = useState();
  
  const [forceOff, setForceOff] = useState();
  const [forceOn, setForceOn] = useState();
  const [statusimg, setStatusImg] = useState(
    AppCtx.usermetadata.is_kibanda_opened
      ? require("../../../assets/images/open.png")
      : require("../../../assets/images/closed.png")
  );

  const [todayAvailableMenu, setTodayAvailableMenu] = useState([]);

  useEffect(() => {
    if (AppCtx.toggleStatus) {
      setStatusImg(require("../../../assets/images/open.png"));
      setForceOn(true);
      setForceOff(false);
    }
  }, [AppCtx.toggleStatus]);

  useEffect(() => {
    const getAvailbleMenu = async () => {
      if (AppCtx.fetchAgainAvailableMenu) {
        setLoadAvailableMenu(true);
        try {
          const data = await pureKibandaAvailableMenuNoAutoAddDefaultMenu(
            AppCtx.usermetadata.id
          );
          setTodayAvailableMenu(data);
          setLoadAvailableMenu(false);
        } catch (error) {
          setLoadAvailableMenu(false);
        }
      }
    };

    getAvailbleMenu();
  }, [AppCtx.fetchAgainAvailableMenu]);

  useEffect(() => {
    const fetchAvailableMenu = async () => {
      if (AppCtx.usermetadata.id) {
        try {
          const data = await pureKibandaAvailableMenuNoAutoAddDefaultMenu(
            AppCtx.usermetadata.id
          );
          setTodayAvailableMenu(data);
          // THIS LINE IS ADDED NOW ITS OKAY TO SAY THIS ALSO WE CAN USE IT
          // TO AS AVAILABLE MENU BUT ITS PURE ONE...
          AppCtx.manipulateTodayKibandaAvailableMenu(data);
        } catch (error) {
        }
      } else {
      }
    };

    fetchAvailableMenu();
  }, [AppCtx.usermetadata]);

  useEffect(() => {
    async function configurePushNotificatons() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropiate permission"
        );
        return;
      }
      try {
        const pushToken = await Notifications.getExpoPushTokenAsync();
        fetch(`${BASE_URL}/api/savedevicenotificationtoken/`, {
          method: "POST",
          body: JSON.stringify({
            user_id: AppCtx.usermetadata.get_user_id,
            token: pushToken.data,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
      }
    }

    configurePushNotificatons();
  });

  // Kama mtu bado hajaset today available menu tuna data ya dizaini hii 
  // THIS ARE MENU AVAILABLE TODAY  {"get_kibanda": {"id": 52}, "get_menu": null, "id": 42, "set_from_default_menu": false}
  useEffect(() => {
    // just detect if we have the today menu to change is today menu set..
    
    // make sure we don't have null in "get_menu"
    if (Object.keys(AppCtx.todayKibandaAvailableMenu).length > 0 && AppCtx.todayKibandaAvailableMenu.get_menu) {
      // we have menu so update is available menu set..
      setIsTodayMenuSet(true);
      // do we need to turn on both image and toggle here?
    }
    // tutafute how it looks to give it true
  }, [AppCtx.todayKibandaAvailableMenu]);

  useEffect(() => {
    (async () => {
      try {
        const output = await checkIfTodayAvailableMenuSet(
          AppCtx.usermetadata.get_user_id
        );

        // logic start here, kibanda umefungua but today menu does not set, that is WE CLOSE UR KIBANDA
        // Remember this
        if (AppCtx.usermetadata.is_kibanda_opened && !output.is_available) {
          // HII CONDITON NI NZURI IBAKI HIVHIVI
          // kama kibanda kipo on but it does not have today menu then by default it should be closed
          setStatusImg(require("../../../assets/images/closed.png"));
          AppCtx.manipulateUserMetadata({
            is_kibanda_opened: false,
          });
          updateKibandaStatus({
            user_id: AppCtx.usermetadata.get_user_id,
            status: "false",
          });
          AppCtx.manipulateInitialKibandaStatus(false);
        } else if (!AppCtx.usermetadata.is_kibanda_opened) {
          // I THINK WE DON'T UPDATE THE STATUS OF THE USER AFTER SETTING TODAY MENU...
          // AND WE USE THIS FIELD TO TOGGLE ON OR OFF... i think this is problem because
          // we're not fetching the data of user metadata and update our context..

          AppCtx.manipulateInitialKibandaStatus(false);
        } else {
          // NAWEZA NIKAADD CONDITION NYINGINE HAPA BAADAE AS ELSE IF
          // for other condition i think it should be open
          AppCtx.manipulateInitialKibandaStatus(true);
        }
        // end of if logic
        setIsTodayMenuSet(output.is_available);
      } catch (err) {
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const userdt = await userdetails(AppCtx.usermetadata.get_user_id);
        AppCtx.manipulateUserMetadata(userdt);

        const defaultmenu = await getKibandaDefaultMenu(
          AppCtx.usermetadata.get_user_id
        );
        AppCtx.manipulateDefaultKibandaMenu(defaultmenu);
        setAvailableDefaultMenu(defaultmenu);
      } catch (err) {
      }
    })();
  }, []);

  const executeToggleOnOffAvailableMenu = useCallback(
    async (metadata) => {
      try {
        const result = await manipulateTodayAvailableMenuItem(
          AppCtx.usermetadata.id,
          metadata.menu.id,
          metadata.status ? "add" : "remove"
        );
      } catch (error) {
      }
    },
    [AppCtx.usermetadata]
  );

  const useDefaultMenuAsTodayMenuHandler = async () => {
    AppCtx.manipulateIsLoadingAvailableMenu(true);

    setShowSetTodayMenuDialogue(0);
    // send request to update the today menu
    try {
      const todaymenu = await useDefaultMenuAsTodayMenu(
        AppCtx.usermetadata.get_user_id
      );
      AppCtx.manipulateTodayKibandaAvailableMenu(todaymenu);
      setTodayAvailableMenu(todaymenu);
      AppCtx.manipulateIsLoadingAvailableMenu(false);

      AppCtx.manipulateIsDefaultMenuSetOnOpen(true);
      setForceOff(false);
      // here also we should update the image and post the status to backeend
      // there is no way to have use "status of true of false because if you click
      // use default automatically you want to set default menu.."
      // the status should be only "true" no need to do conditioning
      if (toggleStatus) {
        setStatusImg(require("../../../assets/images/open.png"));
        AppCtx.manipulateUserMetadata({
          is_kibanda_opened: true,
        });

        // IM UPDATING THE USER METADATA
        updateKibandaStatus({
          user_id: AppCtx.usermetadata.get_user_id,
          status: "true",
        });

       
      } else {
        setStatusImg(require("../../../assets/images/closed.png"));
        AppCtx.manipulateUserMetadata({
          is_kibanda_opened: false,
        });
        updateKibandaStatus({
          user_id: AppCtx.usermetadata.get_user_id,
          status: "false",
        });
      }
      // then end of new update block

    } catch (err) {
      // setTodayAvailableMenu(false);
      setForceOff(true);
      // just have image closed..
      setStatusImg(require("../../../assets/images/closed.png"));
      AppCtx.manipulateIsLoadingAvailableMenu(false);
      AppCtx.manipulateIsDefaultMenuSetOnOpen(false);
    }
  };

  const createNewAvalilableMenuHandler = () => {
    setShowSetTodayMenuDialogue(0);
    // navigate to create new available menu screen
    navigation.navigate("AddTodayAvailableMeal", {
      defaultmenu: availableDefaultMenu.get_menu_list,
    });
  };

  // This used as prop in BigCard no need to render the BigCard if this
  // function re-created

  /* if passed props from parent cause children component to be refreshed when its the function re-created? the answer is yes
  A React component re-renders when its state or props change. If your React component depends on other data outside of the 
  component, you may need to force a re-render.
  Kumbe sio lazima iwe ni dependency kwenye useEffect ya nested/child component but if its passed as props
  it cause also the nested component to re-render
  SO HERE WHEN THESE PROPS CHANGE THE HERE THE CHILD/NESTED COMPONENT RE-RENDER, NO NEED TO RE-RENDER 
  https://sentry.io/answers/can-you-force-a-react-component-to-re-render-without-calling-setstate/
*/

  /*no need to do this i think it will update automatically or not because here we didn't look if user
   cancel or not and we tried to save/change the status so for now i will comment this..
    i think i should do these things when user click is default or he set the menu easy...
  */
  /*
  const onOffHandler = useCallback((status) => {
    if (status) {
      // true means opened
      // hapa ndo inapofelia ina-update the image initially.. haitakiwi
      setStatusImg(require("../../../assets/images/open.png"));
      AppCtx.manipulateUserMetadata({
        is_kibanda_opened: true,
      });

      updateKibandaStatus({
        user_id: AppCtx.usermetadata.get_user_id,
        status: "true",
      });

      if (!isTodayMenuSet) {
        // if its false then we should show the message either to use the default one or not..
        setShowSetTodayMenuDialogue((prevState) => prevState + 1);
      }
    } else {
      setStatusImg(require("../../../assets/images/closed.png"));
      AppCtx.manipulateUserMetadata({
        is_kibanda_opened: false,
      });
      updateKibandaStatus({
        user_id: AppCtx.usermetadata.get_user_id,
        status: "false",
      });
    }
  }, []);

  */

  const onOffHandler = useCallback(
    (status) => {
      setToggleStatus(status);
      // AppCtx.manipulateToggleStatus(status);

      //    ********** YOU CAN REMOV THIS LOGIC *********
      // i ADDED IT NOW SO AS TO FORCE INITIALLY TO MAKE IT OFF TO UNTILL USER
      // CLICK OR SET THE TOGGLE SWITCH OFF BUT WHAT IF THE TOGGLE IS ON IT
      // WILL ALSO DISPLABLE IT TO BE OFF, THIS WILL TURN IT OFF.. OOOH WHAT IDEA
      // OF FORCEITOFF IS TO MAKE IT OFF IT USER DIDN'T CLICK ANY OF OPTION TO SET
      // TODAY MENU
      // force toggle off to true in order to disable to turn on initially..
      // setForceOff(true);
      // adde now because i see initially it does not force it off
      // condition ya hii ku-work ni tu-force off if 1. No default menu is set
      // 2.Kibanda is not opened.. hii ndo condtion ya kucheck...
    
      if (!isTodayMenuSet && !AppCtx.usermetadata.is_kibanda_opened) {
        setForceOff(true);
      }
      // you can remove this logic is sth is wrong.. but i think its okay
      //      ********* END OF REMOVAL ***********

      if (status) {
        if (!isTodayMenuSet) {
          // if its false then we should show the message either to use the default one or not..
          setShowSetTodayMenuDialogue((prevState) => prevState + 1);
        }
        // if today menu set no need to display the popup
        else {
          setStatusImg(require("../../../assets/images/open.png"));
          AppCtx.manipulateUserMetadata({
            is_kibanda_opened: true,
          });

          updateKibandaStatus({
            user_id: AppCtx.usermetadata.get_user_id,
            status: "true",
          });
        }
      } else {
        // we should do the stuffs to turn off
        setStatusImg(require("../../../assets/images/closed.png"));
        AppCtx.manipulateUserMetadata({
          is_kibanda_opened: false,
        });
        updateKibandaStatus({
          user_id: AppCtx.usermetadata.get_user_id,
          status: "false",
        });
      }
    },
    [isTodayMenuSet, AppCtx.usermetadata]
  );

  //after set menu we should increment this to 2 or greater to avoid this dialogue being displayed again when we try to change status
  // but i dont think if there are needs for that
  const menuDialogueHandler = useCallback(() => {
    setShowSetTodayMenuDialogue(1);
  }, []);

  if (!availableDefaultMenu) {
    return <LoadingSpinner />;
  }

  // i think we should execute this everythime user toggle on the status
  // initially is === 1, also make sure that if user have set the showmenudialogue
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View
        style={{
          display: showSetTodayMenuDialogue ? "flex" : "none",
          position: "absolute",
          top: "10%",
          zIndex: 10000000000,
          alignSelf: "center",
          height: 330,
          width: 330,
          justifyContent: "center",
        }}
      >
        <CustomizedLottieMessage2
          messageHeader={"Set Today's Menu"}
          subHeader={"By default we'll use your default menu."}
          buttonTitle={"Use default"}
          buttonTitle2={"Set Menu"}
          lottieFile={require("../../../assets/LottieAnimations/105660-diet-list.json")}
          understandHandler={useDefaultMenuAsTodayMenuHandler}
          understandHandler2={createNewAvalilableMenuHandler}
          cancelHandler={() => {
            setStatusImg(require("../../../assets/images/closed.png"));
            setForceOff(true);
            AppCtx.manipulateIsDefaultMenuSetOnOpen(false);
            setShowSetTodayMenuDialogue(0);
          }}
        />
      </View>

      <ScrollView
        style={[styles.container, { zIndex: -1 }]}
        pointerEvents={showSetTodayMenuDialogue ? "none" : "auto"}
      >
        <View style={styles.bigCardHolder}>
          <BigCard
            gradientColors={[COLORS.secondary, "#FFA200"]}
            title="Restaurant Status"
            forceOff={forceOff}
            rStatusImg={statusimg}
            onChangeHandler={onOffHandler}
          />
        </View>
        <View style={styles.bigCardHolder}>
          <AvailableMenuCard
            manipulateShowSetTodayMenuDialogueHandler={menuDialogueHandler}
            gradientColors={[COLORS.secondary, "#FFA200"]}
            defaultMenu={availableDefaultMenu}
            title="Available Menu"
            menuitems={todayAvailableMenu}
            rStatusImg={statusimg}
            onOffHandler={executeToggleOnOffAvailableMenu}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(DashboardScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bigCardHolder: {
    flex: 0.4,
    margin: "2%",
    marginTop: "5%",
  },
  cardHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "2%",
    marginTop: "5%",
    flex: 0.2, // i added this so make sure your cards occupy 20% of the screen
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
