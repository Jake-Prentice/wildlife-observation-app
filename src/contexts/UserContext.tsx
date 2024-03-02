import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { FIREBASE_AUTH } from 'src/FirebaseConfig';
import { doc, getDoc, Firestore } from 'firebase/firestore';
import { db } from 'src/FirebaseConfig';  
import { UserStatSchema } from '@/services/schemas';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export interface IUserValue {
  info: User | null;
  stats: UserStatSchema | null; 
  logout: () => void;
}

const UserContext = React.createContext<Partial<IUserValue>>({});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStatSchema | null>(null);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
          setUser(user);
          if (user) {
              const userStatsDocRef = doc(db, 'user-stats', user.uid);
              const userStatDoc = await getDoc(userStatsDocRef);

              if (userStatDoc.exists()) setUserStats(userStatDoc.data() as UserStatSchema);
              else {
                  console.log('No user profile found');
                  setUserStats(null);
              }
          }
    });
      // Cleanup subscription on unmount
      return () => unsubscribe();
  }, []);

  const logout = async () => {
      try {
          await signOut(FIREBASE_AUTH);
          console.log('User signed out successfully');
          setUserStats(null); 
      } catch (error) {
          console.error('Error signing out: ', error);
      }
  };


  const value = {
    info: user,
    stats: userStats,  
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );

};

export const useUser = () => {
  return useContext(UserContext) as IUserValue;
}
