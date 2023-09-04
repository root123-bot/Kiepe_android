/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import Background from "./Background";
import Background2 from "./Background2";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { BASE_URL } from "../../constants/domain";

function CoverPhoto({ fileHandler, isValid, imageUrl, isOnEditing }) {
  const [image, setImage] = useState({
    data: undefined,
  });
  const [imageToPreview, setImageToPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to use this feature",
        [{ text: "Okay" }]
      );
      return false;
    }

    return true;
  }

  async function loadImageHandler() {
    try {
      setIsLoading(true);
      const captured = await launchImageLibraryAsync({
        quality: 0.2,
      });
      if (!captured.canceled) {
        fileHandler(captured);
      }

      setImage({ data: captured.assets[0].uri, state: "taken" });
      setImageToPreview({ uri: captured.assets[0].uri });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function takeImageHandler() {
    try {
      setIsLoading(true);
      // kwenye iOS permission kucheck inahitajika ila kwenye android hawana baya ukiweka hii conditin ya verifyPermission inagoma kwenye android coz default value is DENIED in android..
      if (Platform.OS === "ios") {
        const hasPermission = await verifyPermission();

        if (!hasPermission) {
          setIsLoading(false);
          return;
        }
      }
      const captured = await launchCameraAsync({});
      if (!captured.canceled) {
        fileHandler(captured);
      }
      setImage({ data: captured.assets[0].uri, state: "taken" });
      setImageToPreview({ uri: captured.assets[0].uri });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Background2
      statusStyle="dark"
      imageToUpdate={imageToPreview}
      loading={isLoading}
      style={{
        borderRadius: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: isValid ? "grey" : "red",
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          style={{ marginBottom: 15 }}
          onPress={takeImageHandler}
        >
          <MaterialCommunityIcons
            name="camera-plus"
            size={30}
            color={COLORS.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={loadImageHandler}>
          <Entypo name="save" size={30} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.preview}></View>
    </Background2>
  );
}

export default memo(CoverPhoto);

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: 240,
  },
});
