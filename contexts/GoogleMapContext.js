import React, { createContext, useContext, useState } from 'react';

//Context as a Shareable Item, Provider as a Definition and Usage, useContext to Allow Usage of Provider
const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const APIKEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

    //Get A Place ID to Get Details and Pictures
    //Find the Place ID via place name or coordination (TODO: Coordination via GeoCoding)
    async function getPlaceID(placeName){
        let response = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "X-Goog-Api-Key": APIKEY,
                "X-Goog-FieldMask" : "places.name,places.id,places.displayName"
            },
            body:JSON.stringify({
                "textQuery": placeName
            })
        })

        response=await response.json();

        //May Return List of Places
        let places = response.places;
        getPlaceDetails(places[0].id)
    }

    //Get Details to Display 
    async function getPlaceDetails(placeID){
        let response = await fetch(`https://places.googleapis.com/v1/places/${placeID}`, {
            headers:{
                "Content-Type": "application/json",
                "X-Goog-Api-Key": APIKEY,
                "X-Goog-FieldMask" : "displayName,formattedAddress,location"
            },
        })

        response = await response.json();

        //Extract Display Data 
        let locationName = response.displayName.text;
        let address = response.formattedAddress;
        let coordinates = response.location;

        console.log("The location name is ",locationName);
        console.log("The address is ", address);
        console.log("The coordinates is ", coordinates);
    }

    
    
    return (
        <GoogleMapContext.Provider value={{ loading, getPlaceID}}>
            {children}
        </GoogleMapContext.Provider>
    )
}

export const useGoogleMap = () => useContext(GoogleMapContext);