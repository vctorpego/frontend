import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (userToken) {
      setUser(JSON.parse(userToken));
    }
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await api.post("/signin", { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem("user_token", JSON.stringify({ email, token }));
        setUser({ email });
        return null;
      }
    } catch (error) {
      console.error(error);
      return "Erro ao realizar login";
    }
  };

  const signup = (email, password) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));
    const hasUser = usersStorage?.filter((user) => user.email === email);

    if (hasUser?.length) {
      return "Já tem uma conta com esse E-mail";
    }

    let newUser;

    if (usersStorage) {
      newUser = [...usersStorage, { email, password }];
    } else {
      newUser = [{ email, password }];
    }

    localStorage.setItem("users_bd", JSON.stringify(newUser));

    return;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
