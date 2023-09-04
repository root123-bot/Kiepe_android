/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { memo } from "react";
import * as ImageCache from "react-native-expo-image-cache";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "../../constants/domain";
import { AppContext } from "../../store/context";
import { useContext } from "react";

const height = Dimensions.get("window").height;

function Banner({ profile }) {
  const AppCtx = useContext(AppContext);
  return (
    <LinearGradient colors={["#55A630", "#737373"]} style={styles.lgContainer}>
      <ImageCache.Image
        {...{
          preview: {
            uri: `${BASE_URL}${AppCtx.usermetadata.get_cover_photo}`,
          },
          uri: `${BASE_URL}${AppCtx.usermetadata.get_cover_photo}`,
        }}
        style={styles.imgBack}
        imageStyle={{ opacity: 0.15 }}
      />
      <View
        style={{
          flex: 1,
          // position: "absolute",
          // bottom: "0%",
        }}
      >
        <View style={styles.wrapperView}>
          <View style={styles.innerWrapperView}>
            <View style={styles.conte}>
              <ImageCache.Image
                tint="light"
                transitionDuration={300}
                style={styles.imageProfile}
                {...{
                  preview: {
                    uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
                  },
                  uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
                }}
              />
              <View style={styles.textHolder}>
                <Text numberOfLines={1} style={styles.nameText}>
                  MICHIPSI KIBANDA
                </Text>
                <Text style={styles.sub}>Restaurant</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default memo(Banner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lgContainer: {
    flex: 0.3,
  },
  firstContainer: {
    marginTop: 5,
    backgroundColor: "#f0f0f5",
  },
  secondContainer: {
    marginTop: 5,
    backgroundColor: "#f0f0f5",
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
    fontSize: 20,
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
    borderWidth: 2,
    borderColor: "#55A630",
  },
  authButtonContainer: {
    alignItems: "center",
  },
  increasedMarginTop: {
    marginTop: height < 700 ? 15 : 20,
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
