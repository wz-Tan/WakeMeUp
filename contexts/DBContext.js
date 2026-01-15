import { useContext } from "react";
import { createContext } from "react";

const DBContext = createContext();

export default DBContextProvider = ({ children }) => {
  // Edit Location Name
  async function editSavedLocationName(latitude, longitude, location_name) {
    try {
      let response = await fetch("http://192.168.0.155:4000/location/edit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
          location_name,
        }),
      });

      let data = await response.json();
      if (data.status == 200) {
        return true;
      } else if (data.error) {
        return { error: "Error Editing Location Name " + data.error };
      }
    } catch (error) {
      return { error: "Error Editing Location Name " + error.message };
    }
  }

  return (
    <DBContext.Provider value={{ editSavedLocationName }}>
      {children}
    </DBContext.Provider>
  );
};

export const useDB = () => useContext(DBContext);
