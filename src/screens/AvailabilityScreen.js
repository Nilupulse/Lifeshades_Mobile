import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton/CustomButton";
import { useSelector } from "react-redux";
import EditAvailabilityScreen from "./EditAvailabilityScreen";
import { COLORS } from "../theme/theme";

const AvailabilityScreen = ({ navigation }) => {
  const [availability, setAvailability] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const userData = useSelector((state) => state.userData);
  const userId = userData?.userId;

  useEffect(() => {
    fetchAvailability();
  }, []);

  //fetch availability from API
  const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `https://lifeshaderapi.azurewebsites.net/api/UserService/GetUserAvailabilityByID?id=${userId}`
      );
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  const handleSaveAvailability = async (editedAvailability) => {
    try {
      const response = await fetch(
        `https://lifeshaderapi.azurewebsites.net/api/UserService/UpdateAvailibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAvailability),
        }
      );
      if (response.ok) {
        setAvailability([editedAvailability]);
        //Data updated successfully
        setIsEditing(false);
        console.log("Data updated");
      } else {
        const errorResponse = await response.json();
        console.error("Failed to update data", errorResponse);
      }
    } catch (error) {
      console.error("Error updating availability data:", error);
    }
  };

  if (isEditing) {
    return (
      <EditAvailabilityScreen
        date={availability[0].date}
        fromTime={availability[0].fromTime}
        toTime={availability[0].toTime}
        onSave={handleSaveAvailability}
      />
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {availability.map((item) => {
        //split date and day seperately
        const date = new Date(item.date);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        return (
          <View style={styles.infoContainer} key={item.availabilityId}>
            <Text style={styles.text}>{formattedDate}</Text>
            <Text style={styles.text}>{dayOfWeek}</Text>
            <Text style={styles.text}>
              From: {new Date(item.fromTime).toLocaleTimeString()}
            </Text>
            <Text style={styles.text}>
              To: {new Date(item.toTime).toLocaleTimeString()}
            </Text>
          </View>
        );
      })}

      <CustomButton
        text="Edit Availability"
        onPress={() => setIsEditing(true)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5,
  },
  columns: {
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  infoContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    padding: 15,
    margin: 5,
    backgroundColor: "#87CEEB",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    justifyContent: "space-between",
  },
});

export default AvailabilityScreen;
