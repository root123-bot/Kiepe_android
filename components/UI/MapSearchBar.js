import React, { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

// https://stackoverflow.com/questions/61112430/is-there-a-way-to-grab-the-keyboard-search-return-input-in-react-native-paper-se
function MapSearchBar({ isSearching, searchQueryHandler, title, isLoading }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <View>
      <Searchbar
        placeholder={title ? title : "Search location to pin"}
        mode="bar"
        icon="google-maps"
        placeholderTextColor="grey"
        elevation={2}
        iconColor="grey"
        loading={isLoading}
        value={searchQuery}
        style={styles.search}
        inputStyle={styles.searchInput}
        onChangeText={(query) => setSearchQuery(query)}
        onSubmitEditing={(event) => searchQueryHandler(event.nativeEvent.text)}
      />
    </View>
  );
}
// () => alert('searching...')
export default memo(MapSearchBar);

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
