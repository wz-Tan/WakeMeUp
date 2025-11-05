import React, { createContext, useContext, useState } from "react";

//Context as a Shareable Item, Provider as a Definition and Usage, useContext to Allow Usage of Provider
const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
  const APIKEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const AUTOCOMPLETERESULTS = 6;
  const DETECTRADIUS = 50; //Max 50KM radius

  //TODO : Change to CURRENT Location
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 3.2144774,
    longitude: 101.6721846,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  async function getPlaceAutocomplete(inputLocationName) {
    let { latitude, longitude } = currentRegion;
    let response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": APIKEY,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.distanceMeters,suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
        }, //Use the main text + secondary text to query for location details
        body: JSON.stringify({
          input: inputLocationName,
          locationRestriction: {
            circle: {
              center: {
                latitude: latitude,
                longitude: longitude,
              },
              radius: DETECTRADIUS * 1000, //999 Km Radius
            },
          },
          origin: {
            latitude: latitude,
            longitude: longitude,
          },
        }),
      },
    );

    response = await response.json();

    //Return Top 3 Searches (Get Place Prediction -> text.text and distanceMeters)
    try {
      let suggestions = response.suggestions;
      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i] = suggestions[i].placePrediction;
      }

      //Cap At Desired Amount of Results
      return suggestions.length >= AUTOCOMPLETERESULTS
        ? { data: suggestions.slice(0, AUTOCOMPLETERESULTS) }
        : { data: suggestions };
    } catch (error) {
      //If Error -> No Results Found
      console.log("Autocomplete Context Error: ", error);
      return { error: error };
    }
  }

  //Find the Place ID via place name or coordinates to Query Place Details
  async function getPlaceID(placeName, placeCoordinates) {
    let places;
    if (placeName) {
      let response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": APIKEY,
            "X-Goog-FieldMask": "places.id",
          },
          body: JSON.stringify({
            textQuery: placeName,
          }),
        },
      );

      response = await response.json();
      places = response.places;
      return places[0].id;
    } else if (placeCoordinates) {
      let response = await fetch(
        `https://geocode.googleapis.com/v4beta/geocode/location/${placeCoordinates[0]},${placeCoordinates[1]}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": APIKEY,
            "X-Goog-FieldMask": "results.placeId",
          },
        },
      );

      response = await response.json();
      places = response.results;
      return places[0].placeId;
    }
  }

  //Get Details to Display (Place Coordinates Should be [lat,long])
  async function getPlaceDetails(placeName, placeCoordinates) {
    try {
      let placeID;

      if (placeName) {
        placeID = await getPlaceID(placeName, null);
      }

      //Use Coordinates For Geocoding
      else if (placeCoordinates) {
        placeID = await getPlaceID(null, placeCoordinates);
      }

      let response = await fetch(
        `https://places.googleapis.com/v1/places/${placeID}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": APIKEY,
            "X-Goog-FieldMask":
              "displayName,shortFormattedAddress,location,photos",
          },
        },
      );

      response = await response.json();

      //Extract Display Data
      let locationName = response.displayName.text;
      let address = response.shortFormattedAddress;
      let coordinates = response.location;
      let photoName = response.photos;

      if (photoName) {
        if (photoName.length >= 1) {
          return {
            locationName,
            address,
            coordinates,
            photo: await getPlaceImages(photoName[0].name),
          };
        }
      } else {
        return { locationName, address, coordinates, photo: null };
      }
    } catch (error) {
      return { error };
    }
  }

  async function getPlaceImages(photoName) {
    let imageObject = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?key=${APIKEY}&maxHeightPx=500`,
      { method: "GET" },
    );
    return imageObject.url;
  }

  return (
    <GoogleMapContext.Provider
      value={{
        getPlaceDetails,
        getPlaceAutocomplete,
        currentRegion,
        setCurrentRegion,
      }}
    >
      {children}
    </GoogleMapContext.Provider>
  );
};

export const useGoogleMap = () => useContext(GoogleMapContext);
