import React, { createContext, useContext, useState } from 'react';

//Context as a Shareable Item, Provider as a Definition and Usage, useContext to Allow Usage of Provider
const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const APIKEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

    //Find the Place ID via place name or coordinates to Query Place Details
    async function getPlaceID(placeName, placeCoordinates) {
        let places;
        if (placeName) {
            let response = await fetch("https://places.googleapis.com/v1/places:searchText", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": APIKEY,
                    "X-Goog-FieldMask": "places.id"
                },
                body: JSON.stringify({
                    "textQuery": placeName
                })
            })

            response = await response.json();
            places = response.places;
            return places[0].id
        }

        else if (placeCoordinates) {
            let response = await fetch(`https://geocode.googleapis.com/v4beta/geocode/location/${placeCoordinates[0]},${placeCoordinates[1]}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": APIKEY,
                    "X-Goog-FieldMask": "results.placeId"
                }
            })

            response = await response.json()
            places = response.results;
            return places[0].placeId
        }
    }

    //Get Details to Display (Place Coordinates Should be [lat,long])
    async function getPlaceDetails(placeName, placeCoordinates) {
        let placeID;

        if (placeName) {
            placeID = await getPlaceID(placeName, null);
        }

        //Use Coordinates For Geocoding
        else if (placeCoordinates) {
            placeID = await getPlaceID(null, placeCoordinates)
        }

        let response = await fetch(`https://places.googleapis.com/v1/places/${placeID}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": APIKEY,
                "X-Goog-FieldMask": "displayName,formattedAddress,location,photos"
            },
        })

        response = await response.json();

        //Extract Display Data 
        let locationName = response.displayName.text;
        let address = response.formattedAddress;
        let coordinates = response.location;
        let photoName = response.photos;

        return {locationName, address, coordinates}
        // return {locationName, address, coordinates, photo1: await getPlaceImages(photoName[0].name), photo2: await getPlaceImages(photoName[1].name)}
    }

    async function getPlaceImages(photoName) {
        let imageObject = await fetch(`https://places.googleapis.com/v1/${photoName}/media?key=${APIKEY}&maxHeightPx=100`, { method: "GET" });
        return imageObject.url;
    }

    return (
        <GoogleMapContext.Provider value={{ loading, getPlaceDetails }}>
            {children}
        </GoogleMapContext.Provider>
    )
}

export const useGoogleMap = () => useContext(GoogleMapContext);