/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { Text, View, StyleSheet, Pressable } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useState, useContext, memo } from "react";
import { AppContext } from "../store/context";
import { changePassword } from "../utils/requests";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { TransparentPopUpIconMessage } from "../components/UI/Message";

function ChangePasswordScreen() {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);

  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const [loading, setLoading] = useState(false);
  const [opassword, setOpassword] = useState({
    value: "",
    isValid: true,
  });
  const [npassword, setNpassword] = useState({
    value: "",
    isValid: true,
  });
  const [cpassword, setCpassword] = useState({
    value: "",
    isValid: true,
  });

  async function changePasswordHandler() {
    setLoading(true);
    const oPasswordValid = opassword.value.trim().length === 4;
    const nPasswordValid = npassword.value.trim().length === 4;
    const cPasswordValid = cpassword.value.trim().length === 4;
    if (!oPasswordValid || !nPasswordValid || !cPasswordValid) {
      alert("Please make sure you have filled all the fields correctly");
      setOpassword({
        ...opassword,
        isValid: oPasswordValid,
      });
      setNpassword({
        ...npassword,
        isValid: nPasswordValid,
      });
      setCpassword({
        ...cpassword,
        isValid: cPasswordValid,
      });
      setLoading(false);
      return;
    }

    try {
      setShowAnimation(true);
      setFormSubmitLoader(true);
      const result = await changePassword(
        AppCtx.usermetadata.get_user_id,
        opassword.value,
        npassword.value,
        cpassword.value
      );
      setIcon("check");
      setMessage("Succes");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
        navigation.navigate("Setting");
      }, 1000);
      //   if result then password changed successful
    } catch (error) {
      setCpassword((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
      setOpassword((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      setNpassword((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
      setIcon("close");
      setMessage("Failed");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
      }, 1000);
    }
    setLoading(false);
  }

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
          display: formSubmitLoader ? "flex" : "none",
          height: 150,
          width: 150,
          alignSelf: "center",
          position: "absolute",
          top: "40%",
          zIndex: 10,
        }}
      >
        <TransparentPopUpIconMessage
          messageHeader={message}
          icon={icon}
          inProcess={showAnimation}
          textStyle={{
            textAlign: "center",
          }}
        />
      </View>

      <View
        pointerEvents={formSubmitLoader ? "none" : "auto"}
        style={styles.container}
      >
        <TextInput
          label="Old Password"
          mode="outlined"
          keyboardType="numeric"
          maxLength={4}
          outlineColor={opassword.isValid ? "#000" : "#EF233C"}
          activeOutlineColor={opassword.isValid ? "#000" : "#EF233C"}
          onChangeText={(text) =>
            setOpassword((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            })
          }
          style={styles.formInput}
          secureTextEntry
          value={opassword.value}
        />
        <TextInput
          label="New Password"
          mode="outlined"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          outlineColor={npassword.isValid ? "#000" : "#EF233C"}
          activeOutlineColor={npassword.isValid ? "#000" : "#EF233C"}
          onChangeText={(text) =>
            setNpassword((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            })
          }
          value={npassword.value}
          style={styles.formInput}
        />
        <HelperText
          padding="none"
          style={{
            color: COLORS.secondary,
            fontFamily: "montserrat-17",
          }}
          type="info"
        >
          ** only four numbers required
        </HelperText>
        <TextInput
          label="Confirm Password"
          mode="outlined"
          keyboardType="numeric"
          maxLength={4}
          outlineColor={cpassword.isValid ? "#000" : "#EF233C"}
          activeOutlineColor={cpassword.isValid ? "#000" : "#EF233C"}
          secureTextEntry
          onChangeText={(text) =>
            setCpassword((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            })
          }
          value={cpassword.value}
          style={styles.formInput}
        />
        <HelperText
          padding="none"
          style={{
            color: COLORS.secondary,
            fontFamily: "montserrat-17",
          }}
          type="info"
        >
          ** only four numbers required
        </HelperText>
        <Button
          mode="contained"
          loading={loading}
          style={{ marginTop: "5%" }}
          buttonColor={COLORS.secondary}
          onPress={changePasswordHandler}
        >
          Change Password
        </Button>
      </View>
    </View>
  );
}

export default memo(ChangePasswordScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "5%",
  },
  formInput: {
    marginTop: "2%",
  },
});
