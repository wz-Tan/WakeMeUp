import { useContext } from "react";
import { createContext } from "react";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const TOKEN_NAME = "Auth_JWT";

  async function loadAuthToken() {
    try {
      const token = await getItemAsync(TOKEN_NAME);

      if (token) {
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
    } catch (err) {
      // Server Side Error
      return { error: err };
    }
  }
  async function authSignOut() {
    try {
      await deleteItemAsync(TOKEN_NAME);
      return { status: 200 };
    } catch (err) {
      console.log("Error signing out", err);
      return { error: err };
    }
  }

  async function authSignUp() {}
  return (
    <AuthContext.Provider value={{ loadAuthToken, authSignIn, authSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
