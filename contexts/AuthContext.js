import React, { createContext, useContext } from "react";
import { Pool } from "pg";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);

  // Get The Database First
  async function init() {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: true,
      },
    });

    const client = await pool.connect();
    setAuthLoading(false);
  }

  init();

  async function logIn() {}
  return (
    <AuthContext.Provider value={{ authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
