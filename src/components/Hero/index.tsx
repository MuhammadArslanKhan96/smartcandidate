import React from "react";
import CreateSong from "../CreateSong";
import Songs from "../Songs";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { languages, useTranslation } from "@/context/TranslationContext";

const Hero = () => {
  const { selectedLang, setSelectedLang, translations } = useTranslation();
  const { user, setUser } = useAuthContext();

  async function logout() {
    await signOut(auth).then(() => {
      setUser(undefined);
    });
  }

  return (
    <div className="w-full min-h-screen py-4 lg:py-12 px-5 lg:px-16 h-full bg-black text-white">
      <div className="border-b flex justify-between items-center border-gray-400 pb-4">
        <h1 className="font-bold text-lg lg:text-3xl">{translations["createJingle"]}</h1>
        <div className="flex items-center gap-x-4">
          {!!user?.isAdmin && (
            <Link
              href="/admin"
              className="font-bold text-base lg:text-xl">
              Admin
            </Link>
          )}
          {!!user?.email && (
            <Link href="/signin">
              <button onClick={logout} className="font-bold text-base lg:text-xl">{translations["logout"]}</button>
            </Link>
          )}
          <select value={selectedLang} className="bg-black px-4 py-2 rounded-md border-none outline-none cursor-pointer" onChange={e => setSelectedLang(e.target.value)}>
            {Object.keys(languages).map(code => (
              <option key={code} value={code}>{languages[code].label}</option>
            ))}
          </select>
        </div>
      </div>
      <CreateSong />
      <Songs />
    </div>
  );
};

export default Hero;
