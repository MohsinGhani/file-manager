"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import DynamicHeader from "./component/header";
import "./globals.css";

type Dispatch<T> = (action: T) => void;

interface AuthContextType {
  user: null;
  setUser: Dispatch<any>;
  setUpRecaptcha: (number: any) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  setUpRecaptcha: (number: any) => Promise.resolve({} as ConfirmationResult),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);

  const setUpRecaptcha = (number: any) => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const userDoc = doc(db, "Users", u.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const { role } = userData;

            const updatedUser: any = {
              uid: u.uid,
              email: u.email,
              role: role,
            };

            setUser(updatedUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser, setUpRecaptcha }}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </AuthContext.Provider>
    </>
  );
}

export const useAuthContext = () => useContext(AuthContext);
