import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchUser = async () => {
  setLoading(true);

  try {
    const response = await axios.get(
      "https://bookease-ya30.onrender.com/api/v1/auth/me",
      { withCredentials: true }
    );

    setUser(response.data.user);
    return response.data.user;
  } catch (error) {
    setUser(null);
    return null;
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
