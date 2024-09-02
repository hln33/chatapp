import { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  username: string;
};

type UserContextType = {
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  login: (username: string) => void;
  logout: () => void;
};
const UserContext = createContext<UserContextType | null>(null);

type Props = {
  children: ReactNode;
};
function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const login = (username: string) => setUser({ username });
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    throw new Error('useUser was not used with a UserProvider');
  }

  return context;
}

export { UserProvider, useUser };
