/* eslint-disable react-native/no-inline-styles */
import React, { memo, useContext } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AppContext } from "../../store/context";
import Banner from "../../components/Kibanda/Banner";
import { ScrollView } from "react-native-gesture-handler";
import CustomLine from "../../components/UI/CustomLine";
import { LinearGradient } from "expo-linear-gradient";
import PressableIconTextContainer from "../../components/UI/PressableIconTextContainer";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const deviceHeight = Dimensions.get("window").height;

function CustomDrawerContent(props) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
 
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Banner profile={AppCtx.usermetadata} />
      <ScrollView style={styles.parentOuterView} {...props}>
        <View style={styles.outerView}>
          <View>
            <LinearGradient
              style={styles.firstContainer}
              colors={[COLORS.secondary, "#FFA200"]}
            >
              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="contacts"
                onPress={() =>
                  navigation.navigate("EditProfileKibanda", {
                    usermetadata: AppCtx.usermetadata,
                  })
                }
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                My Profile
              </PressableIconTextContainer>
              <CustomLine style={{ marginBottom: 1, marginHorizontal: 10 }} />

              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="lock"
                onPress={() => {
                  AppCtx.manipulateTargettedChangePassword("kibanda");
                  navigation.navigate("ChangePassword");
                }}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Change Password
              </PressableIconTextContainer>
            </LinearGradient>
            <LinearGradient
              style={{
                marginVertical: 5,
              }}
              colors={[COLORS.secondary, "#FFA200"]}
            >
              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="lock"
                onPress={() => navigation.navigate("Setting")}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Customer Panel
              </PressableIconTextContainer>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
      <CustomLine />
      <View style={{ alignItems: "center" }}>
        <PressableIconTextContainer
          color="#d9534f"
          size={28}
          name="logout"
          onPress={() => {
            AppCtx.logout();
          }}
          titleStyle={{ marginLeft: 8, color: "#d9534f" }}
          style={{ paddingVertical: 10 }}
        >
          Logout
        </PressableIconTextContainer>
      </View>
    </View>
  );
}

export default memo(CustomDrawerContent);

const styles = StyleSheet.create({
  lgContainer: {
    flex: 0.3,
  },
  firstContainer: {
    marginTop: 5,
  },
  secondContainer: {
    marginTop: 5,
  },
  drawerItemsContainer: {
    margin: 0,
    padding: 0,
  },

  parentOuterView: {
    flex: 1,
  },
  outerView: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  title: {
    fontFamily: "montserrat-17",
    textAlign: "center",
    color: "white",
    fontSize: 25,
  },

  textHolder: {
    marginLeft: 10,
  },
  nameText: {
    fontFamily: "overpass-reg",
    fontSize: 25,
    color: "white",
  },
  sub: {
    fontFamily: "montserrat-17",
    fontSize: 15,
    color: "white",
  },
  wrapperView: {
    flex: 1,
    height: "100%",
    width: "100%",
    // marginBottom: deviceHeight < 700 ? 15 : 30,
  },
  innerWrapperView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
  },
  conte: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  authButtonContainer: {
    alignItems: "center",
  },
  increasedMarginTop: {
    marginTop: deviceHeight < 700 ? 15 : 20,
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
