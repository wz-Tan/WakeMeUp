import React, { createContext, useContext, useEffect, useState } from 'react';

//Context as a Shareable Item, Provider as a Definition and Usage, useContext to Allow Usage of Provider
const GoogleMapContext = createContext();

export const GoogleMapProvider = ({ children }) => {
    const [google,setGoogle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        initGoogle();
    },[])
    
    const initGoogle = async () => {
        const response = await fetch(`https://places.googleapis.com/v1/places/GyuEmsRBfy61i59si0?fields=addressComponents&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`);
        if (!response){
            console.log("Google Is Not Connected. Please Try Again")
        }
        
        setGoogle(response)
        setLoading(false)
    }
    
    return (
        <GoogleMapContext.Provider value={{google, loading}}>
            {children}
        </GoogleMapContext.Provider>
    )
}

export const useGoogleMap = () => useContext(GoogleMapContext);