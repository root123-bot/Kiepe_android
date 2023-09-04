import React, { memo } from "react";
import { Text, View } from "react-native";

function KibandaIndexScreen() {
  return (
    <View>
      <Text>Im the index screen</Text>
    </View>
  );
}

export default memo(KibandaIndexScreen);
