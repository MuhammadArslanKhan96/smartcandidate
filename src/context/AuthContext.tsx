"use client";
import { auth, db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const AuthContext = createContext({
  user: undefined,
  setUser: (_user: any) => { },
  userSongs: [],
  setUserSongs: (_user: any) => { },
  loadingUser: true
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(undefined);
  const [userSongs, setUserSongs] = useState([]);
  const pathUrl = usePathname();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (!user) {
        setLoadingUser(false);
        return;
      };
      setLoadingUser(true);
      const { email } = user;
      const userData = await getDoc(doc(db, "users", email));
      if (userData.exists()) {
        const newUser = userData.data();

        setUser(newUser)


        const userSongsQuery = query(collection(db, "songs"), where("user", '==', email));
        const userSongsDocs = await getDocs(userSongsQuery);

        const userSongs = userSongsDocs.docs.map(doc => ({ ...doc.data(), id: doc.id, exists: doc.exists() })).filter(doc => doc.exists);

        setUserSongs(userSongs || []);
        setLoadingUser(false);

      }
    })
  }, [])

  useEffect(() => {

    if (user && pathUrl.startsWith("/sign")) {
      router.push("/")
    } else if (!user && pathUrl === '/') {
      router.push("/signin")
    } else if (user && !user.isAdmin && pathUrl === "/admin") {
      router.push("/")
    }

  }, [user, router, pathUrl])

  return (
    <AuthContext.Provider value={{ user, setUser, userSongs, setUserSongs, loadingUser }}>
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
