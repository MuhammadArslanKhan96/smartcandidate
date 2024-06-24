"use client";
import UsersTableAdmin from "@/components/UsersTableAdmin";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React from "react";

export default function Page() {
  const { user, setUser } = useAuthContext();

  async function logout() {
    await signOut(auth).then(() => {
      setUser(undefined);
    });
  }
  return (
    <div className="w-full h-full min-h-screen bg-black text-white mx-auto py-4 lg:py-16">
      <div className="border-b flex px-5 justify-between items-center border-gray-400 pb-4">
        <Link href="/" className="font-bold text-lg lg:text-3xl">Smart Candidate</Link>
        {!!user?.email && (
          <Link href="/signin">
            <button onClick={logout} className="font-bold text-base lg:text-xl">Logout</button>
          </Link>
        )}
      </div>
      <UsersTableAdmin />
    </div>
  )
}