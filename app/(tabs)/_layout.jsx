import NavBar from "@/assets/components/NavBar";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import ToastManager from "toastify-react-native";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import PermissionRequest from "@/assets/components/PermissionRequest";

//Main Layout (Safe Area -> Gesture -> View -> Outlet)
export default function TabLayout() {
  const { loading, requestLocationPermission } = useGoogleMap();
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Load Google Map
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading Google Map...</Text>
      </SafeAreaView>
    );
  }

  // Ask for Permission
  useEffect(() => {
    const requestPermissions = async () => {
      setPermissionGranted(await requestLocationPermission());
    };
    requestPermissions();
  }, []);

  // Return Permission Screen Until It is Granted
  if (!permissionGranted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <PermissionRequest clearPopUp={() => setPermissionGranted(true)} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: { display: "none" },
                freezeOnBlur: true,
              }}
            >
              <Tabs.Screen name="index" />

              <Tabs.Screen name="map" />

              <Tabs.Screen name="settings" />

              <Tabs.Screen name="autocomplete" />
            </Tabs>

            <NavBar />
          </View>
        </GestureHandlerRootView>
        <ToastManager />
      </SafeAreaView>
    </View>
  );
}
