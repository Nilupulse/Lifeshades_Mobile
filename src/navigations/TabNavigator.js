import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ShiftScreen from "../screens/ShiftScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { COLORS } from "../theme/theme";
import AddButton from "../components/AddButton";
import { useTabMenu } from "../context/TabContext";
import ClockScreen from "../screens/ClockScreen";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
const Tab = createBottomTabNavigator();
import { Provider } from "react-redux";
import { setUserData } from "../components/store/actions";
import { useDispatch } from "react-redux";

const getIconColor = (focused) => ({
  tintColor: focused ? COLORS.blue : COLORS.dark,
});

const TabNavigator = ({ navigation }) => {
  const { opened, toggleOpened } = useTabMenu();
  const route = useRoute();
  const userInfo = route.params?.userInfo;
  const dispatch = useDispatch();

  console.log("userinfo", userInfo);
  useEffect(() => {
    dispatch(setUserData(userInfo));
    return () => {};
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userInfo }}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.blue,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/Home.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="Shift"
        component={ShiftScreen}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.blue,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/shift.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="Add"
        component={HomeScreen}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarButton: () => (
            <AddButton opened={opened} toggleOpened={toggleOpened} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarItemStyle: {
            height: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background, // Change this color to your desired color
          },
          headerTintColor: COLORS.blue,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/profile.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background, // Change this color to your desired color
          },
          headerTintColor: COLORS.blue,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/Setting.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    padding: 0,
    left: 16,
    right: 16,
    bottom: 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderTopColor: "transparent",
    shadowColor: COLORS.blue,
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabIconContainer: {
    position: "absolute",
    top: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 32,
    height: 32,
  },
});

export default TabNavigator;
