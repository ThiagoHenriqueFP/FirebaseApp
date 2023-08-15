/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../services/firebaseConfig";
const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthGoogleProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadStorageAuth = () => {
      const sessionToken = sessionStorage.getItem("@AuthFirebase::token");
      const sessionUser = sessionStorage.getItem("@AuthFirebase::user");
      if (sessionToken && sessionUser) {
        setUser(sessionUser);
      }
    };
    loadStorageAuth();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUser(user);
        sessionStorage.setItem("@AuthFirebase::token", token);
        sessionStorage.setItem("@AuthFirebase::user", JSON.stringify(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <AuthGoogleContext.Provider value={{ signInWithGoogle, signed: !!user }}>
      {children}
    </AuthGoogleContext.Provider>
  );
};
