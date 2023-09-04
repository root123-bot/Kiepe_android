import React, { memo, useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { AppContext } from "../../store/context";

function SearchComponent({ searchQueryHandler }) {
  const AppCtx = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  // const [icon, setIcon] = useState(AppCtx.favIcon);

  return (
    <View>
      <Searchbar
        placeholder="Search place or restaurant"
        mode="bar"
        icon={AppCtx.favIcon}
        onIconPress={() => {
          if (AppCtx.favIcon === "heart-outline") {
            // setIcon("heart");
            AppCtx.manipulateFavIcon("heart")
            AppCtx.manipulateToggleFavorite(true);
          } else if (AppCtx.favIcon === "heart") {
            // setIcon("heart-outline");
            AppCtx.manipulateFavIcon("heart-outline")
            AppCtx.manipulateToggleFavorite(false);
          }
        }}
        placeholderTextColor="grey"
        elevation={2}
        iconColor="grey"
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        onChangeText={(query) => {
          searchQueryHandler(query);
          setSearchQuery(query);
        }}
      />
    </View>
  );
}

export default memo(SearchComponent);

const styles = StyleSheet.create({
  search: {
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    fontFamily: "montserrat-17",
    color: "grey",
  },
});
