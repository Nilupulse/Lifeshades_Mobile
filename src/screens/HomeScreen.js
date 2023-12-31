import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { COLORS } from "../theme/theme";
import { useSelector } from "react-redux";
import TabContainer from "../components/TabContainer";
import moment from "moment/moment";
import { useRoute } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [data, setdata] = useState([]);
  const [currentIndex, setcurrentIndex] = useState();
  const [refFlatList, setrefFlatList] = useState();
  const [newsId, setnewsId] = useState("");
  let [shiftDate, setShiftDate] = useState([]);
  let [isLoading, setisLoading] = useState(true);
  let [error, setError] = useState();
  let [response, setResponse] = useState();
  const userData = useSelector((state) => state.userData);
  let id = 0;
  const route = useRoute();
  const userInfo = route.params?.userInfo;

  const getUpcomingWeekDates = () => {
    const dates = [];
    const today = moment();
    for (let i = 0; i < 7; i++) {
      dates.push(today.clone().add(i, "days"));
    }
    return dates;
  };

  const upcomingDates = getUpcomingWeekDates();
  const formattedDates = upcomingDates.map((originalDate) =>
    moment(originalDate).format("YYYY-MM-DD")
  );

  useEffect(() => {
    id = userInfo?.userId;
    console.log("UserID");
    console.log(id);
    getListNews();
    getShiftDates();
    return () => {};
  }, []);

  const getListNews = async () => {
    const apiURL = `https://lifeshaderapi.azurewebsites.net/api/NewsService/GetUserNewsByUserID?id=${id}`;
    await fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        Promise.all(
          resJson.map((newsId) => {
            console.log("Newsid: ", newsId.newsId);

            return fetch(
              `https://lifeshaderapi.azurewebsites.net/api/NewsService/GetNewsByID?id=${newsId.newsId}`
            ).then((response) => response.json());
          })
        )
          .then((resJson) => {
            const uniqueData = resJson.filter(
              (item, index, self) =>
                index === self.findIndex((i) => i.newsId === item.newsId)
            );
            setdata(uniqueData);
          })
          .catch((error) => {
            console.error("Please refresh screen by scrolling");
          });
      })
      .catch((error) => {
        console.log("Error: ".error);
      })
      .finally(() => setisLoading(false));
  };
  const getShiftDates = async () => {
    try {
      const response = await fetch(
        `https://lifeshaderapi.azurewebsites.net/api/ShiftServices/GetMyShifts?id=${id}`
      );
      const shiftIds = await response.json();

      const shiftDetailsPromises = shiftIds.map(async (shiftId) => {
        console.log("shiftID: ", shiftId.shiftId);
        const shiftResponse = await fetch(
          `https://lifeshaderapi.azurewebsites.net/api/ShiftServices/GetShiftByID?id=${shiftId.shiftId}`
        );
        const shiftDetail = await shiftResponse.json();

        return shiftDetail;
      });

      const shiftDetails = await Promise.all(shiftDetailsPromises);
      const completedShifts = shiftDetails.filter(
        (shift) => shift.status === "INPROGRESS"
      );

      const shiftDates = completedShifts.map((item) =>
        moment(item.date).format("YYYY-MM-DD")
      );

      setShiftDate(shiftDates);
    } catch (error) {
      // Alert.alert("Please refresh screen by scrolling");
      console.error("Please refresh screen by scrolling", error);
    }
  };
  onClickItem = (item, index) => {
    setcurrentIndex(index);
    const newArrData = data.map((e, index) => {
      if (item.newsId == e.newsId) {
        return {
          ...e,
          selected: true,
        };
      }
      return {
        ...e,
        selected: false,
      };
    });
    setdata(newArrData);
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate("NewsDetailScreen", {
            newsHeading: `${item.newsHeading}`,
            newsDescription: `${item.newsDescription}`,
            photoLink: `${item.photoLink}`,
          })
        }
        style={[
          styles.item,
          {
            margin: 10,
            height: 150,
            borderColor: COLORS.white,
            backgroundColor: item.selected ? "#f0fff0" : "white",
          },
        ]}
      >
        <View
          style={{
            height: 100,
            flexDirection: "row",
          }}
        >
          <Image style={styles.image} source={{ uri: item.photoLink }}></Image>
          <Text style={[styles.title]}>{item.newsHeading}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  getItemLayout = (data, index) => {
    return { length: 161, offset: 161 * index, index };
  };
  const keyExtractor = (item, index) => {
    return item.newsId.toString() + index.toString();
  };
  return (
    <TabContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.text}>Week Shifts</Text>
          <View style={styles.datecontainer}>
            {formattedDates.map((date, index1) => {
              const isDateInSecondList = (date) => shiftDate.includes(date);
              return (
                <View style={styles.datebox}>
                  <Text
                    key={index1}
                    style={
                      isDateInSecondList(date)
                        ? styles.dateText1
                        : styles.dateText
                    }
                  >
                    {moment(date).format("ddd")}
                    {"\n"}
                    {moment(date).format("DD")}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.text}>Latest News</Text>
          <View style={styles.newscontainer}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              // <FlatList
              //   data={data}
              //   renderItem={renderItem}
              //   // keyExtractor={(item) => `key- ${item.newsId.toString()}`}
              //   keyExtractor={(item1) => item1.newsId.toString()}
              //   getItemLayout={getItemLayout}
              //   ref={(ref) => setrefFlatList(ref)}
              // />
              <FlatList
                data={data}
                renderItem={renderItem}
                // keyExtractor={(item) => `key- ${item.newsId.toString()}`}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ref={(ref) => setrefFlatList(ref)}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 5,
    color: COLORS.gray,
  },
  datecontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    padding: 3,
  },
  datebox: {
    textAlign: "center",
    margin: 5,
  },
  dateText1: {
    padding: 3,
    fontSize: 20,
    color: COLORS.white,
    backgroundColor: COLORS.blue,
    fontWeight: "bold",
    textAlign: "center",
    // borderRadius: 50,
  },
  dateText: {
    padding: 3,
    fontSize: 20,
    color: COLORS.blue,
    backgroundColor: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
    // borderRadius: 50,
  },
  item: {
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 16,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  newscontainer: {
    flex: 1,
  },
});

export default HomeScreen;
