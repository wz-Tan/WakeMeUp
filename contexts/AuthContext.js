import { useContext, createContext, useState, useEffect } from "react";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const TOKEN_NAME = "Auth_JWT";
  const [token, setToken] = useState("");

  async function loadAuthToken() {
    try {
      const token = await getItemAsync(TOKEN_NAME);
      if (token) {
        setToken(token);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Error retrieving auth token", err);
      return false;
    }
  }

  async function authSignIn(email, password) {
    console.log("Auth Signed In Called");
    try {
      let response = await fetch("http://192.168.0.152:4000/user/signIn", {
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
      return { error };
    }
  }
  async function authSignOut() {
    try {
      await deleteItemAsync(TOKEN_NAME);
      return { status: 200 };
    } catch (error) {
      console.log("Error signing out", error);
      return { error };
    }
  }

  async function authSignUp(username, email, password) {
    try {
      let response = await fetch("http://192.168.0.152:4000/user/create", {
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
    } catch (err) {
      return { error: err.message };
    }
  }
  return (
    <AuthContext.Provider
      value={{ loadAuthToken, authSignIn, authSignOut, authSignUp, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
