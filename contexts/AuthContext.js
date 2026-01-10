import { useContext, createContext, useState, useEffect, useRef } from "react";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const TOKEN_NAME = "Auth_JWT";
  const token = useRef("");
  const [userData, setUserData] = useState();

  async function loadAuthToken() {
    try {
      const authToken = await getItemAsync(TOKEN_NAME);
      if (authToken) {
        token.current = authToken;
        await getUserInfo();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Error retrieving auth token", err);
      return false;
    }
  }

  // Get User Info to Display in App
  async function getUserInfo() {
    try {
      let response = await fetch("http://192.168.0.154:4000/user/get", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
      });

      response = await response.json();

      if (response.status == 200) {
        setUserData(response.info);
      } else if (response.error) {
        console.log("Error getting user info ", response.error);
      }
    } catch (error) {
      console.log("Error getting user info ", error.message);
    }
  }

  async function authSignIn(email, password) {
    try {
      let response = await fetch("http://192.168.0.154:4000/user/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      response = await response.json();

      if (response.status === 200) {
        // Store JWT Token
        await setItemAsync(TOKEN_NAME, response.token);
      }

      return response;
    } catch (error) {
      // Server Side Error
      return { error: error.message };
    }
  }
  async function authSignOut() {
    try {
      await deleteItemAsync(TOKEN_NAME);
      return { status: 200 };
    } catch (error) {
      console.log("Error signing out", error);
      return { error: error.message };
    }
  }

  async function authSignUp(username, email, password) {
    try {
      let response = await fetch("http://192.168.0.154:4000/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      response = await response.json();
      console.log("Create Account Response", response);

      // Return Response JSON Object
      return response;
    } catch (error) {
      return { error: error.message };
    }
  }
  return (
    <AuthContext.Provider
      value={{
        loadAuthToken,
        authSignIn,
        authSignOut,
        authSignUp,
        userData,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
