/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { StatusBar } from "expo-status-bar";
import React, {
  memo,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { AppContext } from "../../store/context";
import {
  markOrderDeleted,
  customerCancelOrder,
  fetchKibandaOrders,
  kibandaRejectOrder,
  markOrderCompleted,
} from "../../utils/requests";
import { SearchBar } from "@rneui/themed";
import * as ImageCache from "react-native-expo-image-cache";
import { BASE_URL } from "../../constants/domain";
import moment from "moment";
import BottomSheet from "react-native-simple-bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import CustomLine from "../../components/UI/CustomLine";
import { Foundation } from "@expo/vector-icons";
import { Button, HelperText } from "react-native-paper";
import { TransparentPopUpIconMessage } from "../../components/UI/Message";
function AcceptedOrders() {
  const panelRef = useRef(null);

  const AppCtx = useContext(AppContext);
  const [isloading, setIsLoading] = useState(false);
  const [kibandaOrders, setKibandaOrders] = useState(
    AppCtx.kibandaOrders.filter(
      (order) =>
        order.order_status.toLowerCase() === "Accepted".toLowerCase() &&
        !order.mark_as_deleted
    )
  );

  const [totalOrders, setTotalOrders] = useState(
    AppCtx.kibandaOrders.filter(
      (order) =>
        order.order_status.toLowerCase() === "Accepted".toLowerCase() &&
        !order.mark_as_deleted
    ).length
  );

  const [search, setSearch] = useState("");
  const [displayOrderDetails, setDisplayOrderDetails] = useState(false);
  const [targettedOrder, setTargettedOrder] = useState();
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (AppCtx.activeKibandaOrderMetadata.tab) {
      const { tab, shouldRefresh } = AppCtx.activeKibandaOrderMetadata;
      if (shouldRefresh && tab === "Accepted Orders") {
        fetchOrders();
        AppCtx.manipulateActiveKibandaOrderMetadata({
          shouldRefresh: false,
        });
      }
    }
  }, [AppCtx.activeKibandaOrderMetadata.tab]);

  async function markOrderCompletedHandler(order_id) {
    setDisplayOrderDetails(false);
    setShowAnimation(true);
    setFormSubmitLoader(true);
    try {
      const order = await markOrderCompleted(order_id);

      setMessage("success");
      setIcon("check");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
        panelRef.current.togglePanel();
        fetchOrders();
      }, 1000);
    } catch (err) {
      setMessage("failed");
      setIcon("close");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
      }, 1000);
    }
  }

  async function rejectOrderHandler(order_id) {
    setDisplayOrderDetails(false);
    setShowAnimation(true);
    setFormSubmitLoader(true);
    try {
      const order = await kibandaRejectOrder(
        AppCtx.usermetadata.get_user_id,
        order_id
      );
      // i think since we pull it up to refresh itself automatically then there is no need to
      // update our context..
      setMessage("Success");
      setIcon("check");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
        panelRef.current.togglePanel();
        // pullup and refresh the fetching
        fetchOrders();
      }, 1000);
    } catch (err) {
      setMessage("Failed");
      setIcon("close");
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
      }, 1000);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setSearch("");
    setIsLoading(true);
    try {
      const orders = await fetchKibandaOrders(AppCtx.usermetadata.get_user_id);
      setKibandaOrders(
        orders.filter(
          (order) =>
            order.order_status.toLowerCase() === "accepted".toLowerCase() &&
            !order.mark_as_deleted
        )
      );
      setTotalOrders(
        orders.filter(
          (order) =>
            order.order_status.toLowerCase() === "accepted".toLowerCase() &&
            !order.mark_as_deleted
        ).length
      );
      AppCtx.updateKibandaOrdersMetadata(orders);
    } catch (error) {
      // alert("Error: ", error.message);
    }
    setIsLoading(false);
  };

  function ItemPrice({ title, price, containerStyle }) {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
          },
          containerStyle,
        ]}
      >
        <Text
          style={{
            fontFamily: "overpass-reg",
            color: "grey",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "montserrat-17",
            color: "grey",
          }}
        >
          {price}
        </Text>
      </View>
    );
  }

  function onChangeSearchHandler(text) {
    setSearch(text);
    if (text.trim().length > 0) {
      setKibandaOrders((prevState) => {
        return prevState.filter(
          (order) =>
            order.order_id.toLowerCase().includes(text.trim().toLowerCase()) ||
            order.total.includes(text.trim().toLowerCase()) ||
            order.get_assigned_to.brand
              .toLowerCase()
              .includes(text.trim().toLowerCase()) ||
            order.get_assigned_to.phone.includes(text.trim().toLowerCase())
        );
      });

      setTotalOrders(() => {
        return kibandaOrders.filter(
          (order) =>
            order.order_id.toLowerCase().includes(text.trim().toLowerCase()) ||
            order.total.includes(text.trim().toLowerCase()) ||
            order.get_assigned_to.brand
              .toLowerCase()
              .includes(text.trim().toLowerCase()) ||
            order.get_assigned_to.phone.includes(text.trim().toLowerCase())
        ).length;
      });
    } else {
      setKibandaOrders(
        AppCtx.kibandaOrders.filter(
          (order) =>
            order.order_status.toLowerCase() === "Accepted".toLowerCase() &&
            !order.mark_as_deleted
        )
      );

      setTotalOrders(
        AppCtx.kibandaOrders.filter(
          (order) =>
            order.order_status.toLowerCase() === "Accepted".toLowerCase() &&
            !order.mark_as_deleted
        ).length
      );
    }
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

      {kibandaOrders.length < 1 && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              textAlign: "center",
              fontSize: 16,
              color: "grey",
            }}
          >
            You've not accepted any orders yet
          </Text>
          <HelperText
            padding="none"
            style={{
              textAlign: "center",
              fontFamily: "overpass-reg",
            }}
          >
            Drag down to refresh
          </HelperText>
        </View>
      )}
      <SafeAreaView
        style={[
          {
            flex: 1,
            margin: 12,
          },
          displayOrderDetails ? { opacity: 0.2 } : { opacity: 1 },
        ]}
        pointerEvents={
          displayOrderDetails || formSubmitLoader ? "none" : "auto"
        }
      >
        {AppCtx.kibandaOrders.length > 0 ? (
          <>
            <View>
              {/* https://github.com/react-native-elements/react-native-elements/issues/2198
            I've given the container a red background to show what I mean. It looks like
            there's 8px padding on the wrapper. Looking at the code – I think this is the right code – it looks like there's padding set by the theme but that anything passed to containerStyle should work. In this case, I thought passing padding: 0 to containerStyle would work but it doesn't appear to do anything.
            by giving container style of margin -8 looks to solve our issue thanks to 
            " darrylyoung " for putting that suggestion in this github issue to see if there
            something done just have background: "red" in  ur container style..
        */}
              <SearchBar
                platform={Platform.OS === "ios" ? "ios" : "default"}
                showCancel={false}
                round
                placeholder="Search..."
                light
                autoCorrect={false}
                placeholderTextColor="grey"
                leftIcon={{ color: "#55A630" }}
                inputContainerStyle={{
                  height: 40,
                  fontFamily: "montserrat-17",
                }}
                inputStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 15,
                  color: "grey",
                }}
                onChangeText={(text) => {
                  onChangeSearchHandler(text);
                }}
                value={search}
                cancelButtonTitle=""
                containerStyle={{
                  backgroundColor: "transparent",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent",
                  margin: -8,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "3%",
              }}
            >
              <Text
                style={{
                  color: "grey",
                  fontSize: 18,
                  fontFamily: "overpass-reg",
                }}
              >
                Your Orders ({totalOrders})
              </Text>
            </View>
          </>
        ) : (
          <></>
        )}
        {AppCtx.kibandaOrders.length < 1 ? (
          <FlatList
            refreshing={isloading}
            onRefresh={fetchOrders}
            style={{
              flex: 1,
            }}
          />
        ) : totalOrders ? (
          <FlatList
            style={{ flex: 1 }}
            refreshing={isloading}
            keyExtractor={(item) => item.id}
            onRefresh={fetchOrders}
            data={kibandaOrders}
            renderItem={(itemData) => {
              return (
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 100,
                    borderWidth: 1,
                    borderColor: "#CED4DA",
                    borderRadius: 10,
                    backgroundColor: "white",
                    padding: 10,
                    marginVertical: "1%",
                  }}
                  onPress={() => {
                    setTargettedOrder(itemData.item);
                    setDisplayOrderDetails(true);
                    panelRef.current.togglePanel();
                  }}
                >
                  <View
                    style={{
                      height: "20%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "overpass-reg",
                          fontSize: 13,
                          color: "grey",
                        }}
                      >
                        ORDER: #
                        {`${itemData.item.order_id.substring(0, 15)}...`}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "overpass-reg",
                          color: "grey",
                          fontSize: 11,
                        }}
                      >
                        {`${moment
                          .utc(itemData.item.order_date)
                          .local()
                          .startOf("seconds")
                          .fromNow()}`}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "3%",
                      }}
                    >
                      <ImageCache.Image
                        tint="light"
                        transitionDuration={100}
                        style={{
                          width: 70,
                          height: 55,
                          borderColor: COLORS.secondary,
                          borderWidth: 2,
                        }}
                        {...{
                          preview: {
                            uri: `${BASE_URL}${itemData.item.get_assigned_to.cover}`,
                          },
                          uri: `${BASE_URL}${itemData.item.get_assigned_to.cover}`,
                        }}
                      />
                      <View
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "overpass-reg",
                            color: "grey",
                          }}
                        >
                          Customer: {itemData.item.get_ordered_by.phone}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "overpass-reg",
                            color: "grey",
                          }}
                        >
                          Total Items: {itemData.item.get_order_items.length}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "overpass-reg",
                            color: "grey",
                          }}
                        >
                          Total Price: Tsh{" "}
                          {`${itemData.item.total.substring(
                            0,
                            itemData.item.total.indexOf(".")
                          )}`}
                          /=
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <FlatList
            refreshing={isloading}
            onRefresh={fetchOrders}
            style={{
              flex: 1,
            }}
          />
        )}
      </SafeAreaView>

      <BottomSheet
        onClose={() => {
          setDisplayOrderDetails(false);
        }}
        isOpen={displayOrderDetails}
        ref={(ref) => (panelRef.current = ref)}
        sliderMaxHeight={Dimensions.get("window").height * 1}
        wrapperStyle={{
          height: "80%",
        }}
        sliderMinHeight={0}
      >
        {(onScrollEndDrag) => (
          <ScrollView onScrollEndDrag={onScrollEndDrag}>
            <View
              style={[
                {
                  flex: 1,
                },
              ]}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "overpass-reg",
                    }}
                  >
                    {targettedOrder && `#${targettedOrder.order_id}`}
                  </Text>
                </View>
                <View
                  style={{
                    marginVertical: "2%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "overpass-reg",
                      color: "grey",
                      marginBottom: "1%",
                    }}
                  >
                    {targettedOrder &&
                      `Ordered at: ${
                        targettedOrder &&
                        targettedOrder.order_date
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")
                      }`}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "overpass-reg",
                      color: COLORS.thirdary,
                    }}
                  >
                    {targettedOrder &&
                      `Order Status: ${targettedOrder.order_status.replace(
                        targettedOrder.order_status[0],
                        targettedOrder.order_status[0].toUpperCase()
                      )}`}
                  </Text>
                </View>
              </View>
              <CustomLine />
              <View>
                <Text
                  style={{
                    fontFamily: "overpass-reg",
                    fontSize: 18,
                  }}
                >
                  Customer Info
                </Text>
                <View
                  style={{
                    marginLeft: "2%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      color: "grey",
                    }}
                  >
                    Phone:{" "}
                    {targettedOrder && targettedOrder.get_ordered_by.phone}
                  </Text>
                  <HelperText
                    padding="none"
                    style={{
                      color: "grey",
                      lineHeight: 13,
                    }}
                  >
                    You can contact customer through this phone number.
                  </HelperText>
                </View>

                <CustomLine
                  style={{
                    marginTop: "1%",
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginVertical: "2%",
                }}
              >
                <View>
                  <Foundation
                    name="telephone"
                    size={20}
                    color={COLORS.secondary}
                  />
                </View>
                <View
                  style={{
                    marginLeft: "2%",
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "overpass-reg",
                      fontSize: 16,
                    }}
                  >
                    My Phone number
                  </Text>
                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "montserrat-17",
                    }}
                  >
                    {targettedOrder && targettedOrder.get_ordered_by.phone}
                  </Text>
                  <HelperText
                    padding="none"
                    style={{
                      color: "grey",
                      lineHeight: 13,
                    }}
                  >
                    Customer can contact with you through this phone number.
                  </HelperText>
                </View>
              </View>
              <CustomLine />
              <View>
                <View
                  style={{
                    margin: "2%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "overpass-reg",
                      fontSize: 16,
                      marginBottom: "3%",
                    }}
                  >
                    Order Menu Items
                  </Text>
                  {targettedOrder &&
                    targettedOrder.get_order_items.map((data, index) => (
                      <ItemPrice
                        containerStyle={{
                          marginBottom: "2%",
                        }}
                        key={index}
                        title={`${data.menu_name} (${data.quantity})`}
                        price={
                          data.subtotal ? `Tsh ${data.subtotal}/=` : "Free"
                        }
                      />
                    ))}
                </View>
                <CustomLine />
                <ItemPrice
                  containerStyle={{
                    margin: "2%",
                  }}
                  title={"Total Menu Price"}
                  price={
                    targettedOrder &&
                    `Tsh ${targettedOrder.total.substring(
                      0,
                      targettedOrder.total.indexOf(".")
                    )}/=`
                  }
                />
                <ItemPrice
                  containerStyle={{
                    margin: "2%",
                  }}
                  title={"Delivery Charge"}
                  price={"negotiable"}
                />
                {/* hii condition ya ku-check is not "Completed" haimake sense since we only load
                orders here which are of status "Pending", you can remove it if you want.. */}
                {targettedOrder && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* we should not reject again the accepted order */}
                    {/* <Button
                      onPress={rejectOrderHandler.bind(this, targettedOrder.id)}
                      mode="contained"
                      labelStyle={{
                        fontFamily: "montserrat-17",
                      }}
                      style={{
                        backgroundColor: COLORS.danger,
                        borderRadius: 10,
                        marginVertical: "5%",
                        width: "48%",
                      }}
                    >
                      Reject Order
                    </Button> */}
                    <Button
                      onPress={markOrderCompletedHandler.bind(
                        this,
                        targettedOrder.id
                      )}
                      mode="contained"
                      labelStyle={{
                        fontFamily: "montserrat-17",
                      }}
                      style={{
                        backgroundColor: COLORS.secondary,
                        borderRadius: 10,
                        marginVertical: "5%",
                        width: "100%",
                      }}
                    >
                      Mark Completed
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
}

export default memo(AcceptedOrders);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container2: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
