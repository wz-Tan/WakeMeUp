import ImageNotFound from "@/assets/icon/noImage.png"
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import Icon from "react-native-vector-icons/FontAwesome6"
import { scheduleOnRN } from "react-native-worklets"

const MapDetailBox = ({ locationName, address, photoURL, setHideDestinationIcon, loading }:
    {locationName:string, address: string, photoURL: string, setHideDestinationIcon:React.Dispatch<React.SetStateAction<boolean>> , loading: boolean}
)=> {
    //UI Sizes
    let ScreenHeight = Dimensions.get("screen").height;
    let containerHeight = 0;
    
    //Constants 
    const EXPANDEDOFFSET = - ScreenHeight* 0.05;
    const MINIMISEDOFFSET = - ScreenHeight* 0.38;
    const MIDLINE = (EXPANDEDOFFSET + MINIMISEDOFFSET)/2;

    let offsetY = useSharedValue(MINIMISEDOFFSET);
    let originalDifference = useSharedValue(0)
    let startPoint = useSharedValue(0);
    let difference = useSharedValue(0);
    
    //Pan value = difference of start point and current drag - original (moves the item down to its supposed position)
    const pan = Gesture.Pan()
        .onBegin((event) => {
            startPoint.value = event.absoluteY;
            originalDifference.value = offsetY.value;
            try{
              scheduleOnRN(()=>setHideDestinationIcon(true))
            }
            catch(error){
                console.log("error is ", error)
            }
            
            })

        .onChange((event) => {
            difference.value = event.absoluteY - startPoint.value - originalDifference.value;
            
            offsetY.value = -difference.value;
            

            //Logic Check to Keep Bar within Bounds
            if (offsetY.value>=EXPANDEDOFFSET){
                offsetY.value=EXPANDEDOFFSET;
            }

            else if (offsetY.value<=MINIMISEDOFFSET){
                offsetY.value=MINIMISEDOFFSET;
            }
        })

        .onFinalize(()=>{
            if (offsetY.value <= MIDLINE){
                offsetY.value = withSpring(MINIMISEDOFFSET, {duration: 1000}) 
                scheduleOnRN(()=>setHideDestinationIcon(false))
            }
            else{
                offsetY.value = withSpring(EXPANDEDOFFSET, {duration: 1000}) 
                scheduleOnRN(()=>setHideDestinationIcon(true))
            }
            
            
        })
    
        const animatedStyle = useAnimatedStyle(()=>({
            bottom: offsetY.value
        }))

    return (
        <GestureDetector gesture={pan}>
            <Animated.View 
            style={[styles.infoBar, animatedStyle]}
            onLayout={(event)=>{
                if (containerHeight==0){
                    containerHeight=event.nativeEvent.layout.height;
                }
            }}
            >
                <TouchableOpacity style={{ alignSelf: "center", paddingTop: 15 }}>
                    <Icon
                        name="grip-lines"
                        color="#000000"
                        size={18}
                        zIndex={20}
                    />
                </TouchableOpacity>
                <View style={styles.infoBarContentBox}>
                    <Text style={styles.locationName}>
                        {loading? "Loading..." : locationName}
                    </Text>

                    <Text style={styles.addressText}>
                        {loading? "" : address}
                    </Text>

                    <View style={[{ width: "100%", position: "absolute", bottom: 25 }]}>
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
        paddingBottom: 15,
        zIndex: 100
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