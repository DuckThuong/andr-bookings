import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00609c",
        tabBarInactiveTintColor: "#7b8a94",
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "DMSans_500Medium",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#e5ebef",
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "home" : "home-outline"}
              size={24}
            />
          ),
          tabBarLabel: "Trang chủ",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "search" : "search-outline"}
              size={24}
            />
          ),
          tabBarLabel: "Tìm kiếm",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "person" : "person-outline"}
              size={24}
            />
          ),
          tabBarLabel: "Tài khoản",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
