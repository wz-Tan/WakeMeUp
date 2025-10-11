import NavBar from '@/assets/components/NavBar';
import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { Tabs } from 'expo-router';
import React from 'react';

import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//Main Layout (Safe Area -> Gesture -> View -> Outlet)
export default function TabLayout() {
    const {loading} = useGoogleMap();
    if (loading ){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading Google Map</Text>
      </SafeAreaView>
    )
  }
    

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
            <Tabs.Screen
              name="index"
            />

            <Tabs.Screen
              name="map"
            />

            <Tabs.Screen
              name="settings"
            />
          </Tabs>

          <NavBar />
        </View>

      </GestureHandlerRootView>



    </SafeAreaView>


  );
}
