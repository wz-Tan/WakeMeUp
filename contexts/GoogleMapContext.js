import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Location from "expo-location";

//Context as a Shareable Item, Provider as a Definition and Usage, useContext to Allow Usage of Provider
const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
  const APIKEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const AUTOCOMPLETERESULTS = 6;
  const DETECTRADIUS = 50; //Max 50KM radius

  const [mapInitStatus, setMapInitStatus] = useState(true);

  // User Location
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Current Destination is Used for the Detail Box on Map Screen, Updated Via Dragging Map or Selecting Autocomplete Result
  // Default Value is Current Region
  let currentDestination = useRef(currentLocation);
  const [activeDestination, setActiveDestination] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [activeDestinationName, setActiveDestinationName] = useState("");

  function setCurrentDestination(newDestination) {
    currentDestination.current = newDestination;
  }

  // Grant Location Permission
  async function requestLocationPermission() {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    console.log("Foreground Status is ", foregroundStatus);

    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      console.log("Background status is ", backgroundStatus);

      if (backgroundStatus === "granted") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async function getCurrentLocation() {
    let { coords } = await Location.getLastKnownPositionAsync();
    let { latitude, longitude, altitude } = coords;

    return { latitude, longitude, altitude };
  }

  // Get Current Location on Start (Get Current Location, Assign to All)
  async function init() {
    setMapInitStatus(true);

    const coordinates = await getCurrentLocation();
    setCameraValues((prev) => ({
      ...prev,
      center: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    }));

    setCurrentLocation((prev) => ({
      ...prev,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      altitude: coordinates.altitude,
    }));

    setCurrentDestination({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setMapInitStatus(false);
  }

  // Camera Location
  const [cameraValues, setCameraValues] = useState({
    center: {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    },
    zoom: 20, // For Android
    altitude: 100, // For IOS
    pitch: 0,
    heading: 0,
  });

  // Recenter Camera
  async function recenterCamera(target) {
    let coordinates;
    if (target === "current") {
      coordinates = await getCurrentLocation();
    } else if (target === "destination") {
      coordinates = activeDestination;
    }

    setCameraValues((prev) => ({
      ...prev,
      center: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    }));

    setCurrentLocation((prev) => ({
      ...prev,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      altitude: coordinates.altitude,
    }));
  }

  // Google Map API Calls
  async function getPlaceAutocomplete(inputLocationName) {
    let { latitude, longitude } = currentLocation;
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
      return { error };
    }
  }

  //Find the Place ID via place name or coordinates to Query Place Details
  async function getPlaceID(placeName, placeCoordinates) {
    try {
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
    } catch (e) {
      console.log("Error fetching placeID: ", e);
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
        return {
          locationName,
          address,
          coordinates,
          photo: await getPlaceImages(photoName[0].name),
        };
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
        requestLocationPermission,
        getPlaceDetails,
        getPlaceAutocomplete,
        currentLocation,
        activeDestination,
        activeDestinationName,
        setActiveDestinationName,
        setActiveDestination,
        setCurrentLocation,
        currentDestination,
        setCurrentDestination,
        cameraValues,
        setCameraValues,
        recenterCamera,
        getCurrentLocation,
        init,
        mapInitStatus,
      }}
    >
      {children}
    </GoogleMapContext.Provider>
  );
};
export const useGoogleMap = () => useContext(GoogleMapContext);
