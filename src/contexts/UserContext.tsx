import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User} from 'firebase/auth';
import { FIREBASE_AUTH } from 'src/FirebaseConfig'; 
import {} from "firebase/app"


const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

export interface IUserValue {
    info: User | null;
    logout: () => void;
 }

const UserContext = React.createContext<Partial<IUserValue>>({});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  //TODO - maybe move the login and register functions into here instead

  const value = {
    info: user,
    logout
    //...
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return useContext(UserContext) as IUserValue;
}
