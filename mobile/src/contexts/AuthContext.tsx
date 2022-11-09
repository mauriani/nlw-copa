import { createContext, useState } from "react";

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({ name: "Mauriani", avatarUrl: "" });

  async function signIn() {}
  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
