import { Drawer } from "expo-router/drawer";
import React from "react";
import { Text } from "react-native"; 
import { useAppSelector } from "@/store/hooks" 
import { useRouter } from "expo-router";
export default function DrawerLayout() {
  const products = useAppSelector((state) => state.product);
  const router = useRouter();
  return (
    <Drawer
      screenOptions={{
        drawerActiveBackgroundColor: "#176596",
        drawerActiveTintColor: "white",
        drawerItemStyle: { width: 200 },
        drawerStyle: { width: 250 },
        headerStyle: { backgroundColor: "#176596" },
        headerTitleStyle: { color: "white", fontSize: 18, marginLeft: 4 },
        headerTintColor: "white",
        headerRight: () => (
          <Text style={{ color: "white", fontSize: 14, marginRight: 15 }}>
           {products?.products?.length || "No "} products in stock
          </Text>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="uploadProducts"
        options={{
          headerTitle: "Upload Products",
          title: "Upload Products",
        }}
         listeners={{
            drawerItemPress: () => {
              router.replace("/(drawer)/uploadProducts");
            },
          }}
      />
    </Drawer> 
  );
}
