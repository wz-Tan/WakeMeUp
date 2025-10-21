import ImageNotFound from "@/assets/icon/noImage.png"
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import Icon from "react-native-vector-icons/FontAwesome6"

const MapDetailBox = ({ locationName, address, photoURL, setShowBottomBar, showBottomBar }:
    { locationName: string, address: String, photoURL: string, setShowBottomBar: Function, showBottomBar: boolean }) => {
    const MAXHEIGHT = -35;

    //UI Sizes
    let ScreenWidth = Dimensions.get("screen").width;
    let ScreenHeight = Dimensions.get("screen").height;

    let containerHeight = 0;
    let offsetY = useSharedValue(0);

    const pan = Gesture.Pan()
        .onBegin((event) => {
            console.log("Begin to pan ")
        })

        .onChange((event) => {
            console.log(event.translationY)
            offsetY.value = containerHeight + event.translationY;
            console.log("Container height is ", containerHeight)
        })

        .onFinalize((event)=>{
            offsetY.value=withSpring(0)
        })
    
        const animatedStyle = useAnimatedStyle(()=>({
            transform:[{translateY: offsetY.value}]
        }))

    return (
        <GestureDetector gesture={pan}>
            <Animated.View 
            style={[styles.infoBar, { bottom: -35 }, animatedStyle]}
            onLayout={(event)=>{
                if (containerHeight==0){
                    containerHeight=event.nativeEvent.layout.height;
                }
            }}
            >
                <TouchableOpacity style={{ alignSelf: "center", paddingTop: 15 }} onPress={() => setShowBottomBar(!showBottomBar)}>
                    <Icon
                        name="grip-lines"
                        color="#000000"
                        size={18}
                        zIndex={20}
                    />
                </TouchableOpacity>
                <View style={styles.infoBarContentBox}>
                    <Text style={styles.locationName}>
                        {locationName}
                    </Text>

                    <Text style={styles.addressText}>
                        {address}
                    </Text>

                    <View style={[{ width: "100%", position: "absolute", bottom: 30 }]}>
                        <View style={styles.imageBox}>
                            {photoURL ?
                                <Image style={styles.image} source={{ uri: `${photoURL}` }} />
                                :
                                <Image style={styles.image} source={ImageNotFound} />
                            }
                        </View>

                        <TouchableOpacity style={[styles.button, { backgroundColor: "#359DFF" }]}>
                            <Text style={styles.buttonText}>Set Active ✅</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { backgroundColor: "#FF358C" }]}>
                            <Text style={styles.buttonText}>Favourite 🧡</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    infoBar: {
        position: "absolute",
        width: "100%",
        height: "60%",
        backgroundColor: "#F3EEFF",
        borderRadius: 45,
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 15
    },

    infoBarContentBox: {
        paddingTop: 10,
        width: "90%",
        height: "90%",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative"
    },

    locationName: {
        fontSize: 18,
        color: "#000000",
        fontFamily: "bold",
        lineHeight: 24,
    },

    addressText: {
        fontSize: 14,
        color: "#999999",
        fontFamily: "regular"
    },


    imageBox: {
        flexDirection: "row",
        width: "100%",
        height: 180,
        alignItems: "center",
        borderRadius: 15,
        marginVertical: 10
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 15
    },

    button: {
        width: "100%",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 3px 5px #C4C1C1FF",
        marginTop: 10
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "bold",
        lineHeight: 18,
    }




})

export default MapDetailBox