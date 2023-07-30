import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import moment from "moment";
import { COLORS } from "../theme/theme";
import NewsDetailScreen from "../screens/NewsDetailScreen";
import { useSelector } from "react-redux";

const HomeScreen = ({ navigation }) => {
  const route = useRoute();
  const userInfo = route.params?.userInfo;
  const userId = route.params?.id;
  const [data, setdata] = useState([]);
  const [currentIndex, setcurrentIndex] = useState();
  const [refFlatList, setrefFlatList] = useState();
  const [newsId, setnewsId] = useState("");
  const [id, setId] = useState("");

  let [isLoading, setisLoading] = useState(true);
  let [error, setError] = useState();
  let [response, setResponse] = useState();
  const userData = useSelector((state) => state.userData);

  const getUpcomingWeekDates = () => {
    const dates = [];
    const today = moment();

    for (let i = 0; i < 7; i++) {
      dates.push(today.clone().add(i, "days"));
    }

    return dates;
  };
  const upcomingDates = getUpcomingWeekDates();

  // useEffect(() => {
  //   fetch(
  //     "https://lifeshaderapi.azurewebsites.net/api/ShiftServices/GetShiftByID"
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setIsLoading(false);
  //         setResponse(result);
  //       },
  //       (error) => {
  //         setIsLoading(false);
  //         setError(error);
  //       }
  //     );
  // }, []);

  useEffect(() => {
    console.log("////////UserID");
    console.log(userData?.userId);
    console.log(userData);
    getListNews();
    return () => {};
  }, []);

  let getListNews = async () => {
    const apiURL =
      "https://lifeshaderapi.azurewebsites.net/api/NewsService/GetAllNews";
    await fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        // Remove duplicates based on the newsId
        const uniqueData = resJson.filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.newsId === item.newsId)
        );
        setdata(uniqueData);
      })
      .catch((error) => {
        console.log("Error: ".error);
      })
      .finally(() => setisLoading(false));
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
            marginTop: 11,
            height: 150,
            backgroundColor: item.selected ? "#f0fff0" : "white",
          },
        ]}
      >
        <View style={{ height: 100, flexDirection: "row" }}>
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Week Shifts</Text>
      <View style={styles.datecontainer}>
        {upcomingDates.map((date, index) => (
          <View style={styles.datebox}>
            {/* <Text key={index} style={styles.dateText}>
                {date.format("MMM")}
              </Text> */}
            <Text key={index} style={styles.dateText}>
              {date.format("ddd")}
              {"\n"}
              {date.format("D")}
            </Text>
          </View>
        ))}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  datecontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  datebox: {
    padding: 3,
    backgroundColor: COLORS.yellow,
    textAlign: "center",
    margin: 5,
  },
  dateText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
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
    padding: 10,
    borderColor: COLORS.white,
  },
});

export default HomeScreen;
