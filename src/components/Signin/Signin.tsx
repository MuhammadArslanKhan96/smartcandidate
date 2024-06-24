"use client";
import React, { ChangeEvent, useState } from "react";
import { signInWithEmail } from "@/helpers/authHelper";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

import { toast } from "react-hot-toast";
import { db } from "@/utils/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

const Signin: React.FC = () => {
  const { setUser, setUserSongs } = useAuthContext();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signIn = async () => {
    let user: any;

    try {
      if (!credentials.email || !credentials.password)
        return toast.error("Fill All The Fields !!");
      user = await signInWithEmail(credentials.email, credentials.password);

      setUser(user);
      const userSongsQuery = query(collection(db, "songs"), where("user", '==', user?.email));
      const userSongsDocs = await getDocs(userSongsQuery);

      const userSongs = userSongsDocs.docs.map(doc => ({ ...doc.data(), id: doc.id, exists: doc.exists() })).filter(doc => doc.exists);

      setUserSongs(userSongs || []);
      toast.success("Signed In Successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded bg-white p-8 shadow-md">
        <div className="text-left">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in on the internal platform
          </p>
        </div>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                autoComplete="email"
                placeholder="Email"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={signIn}
              className="w-full rounded bg-blue-950 px-4 py-2 font-bold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              SIGN IN NOW
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-sm">
          <Link href="/signup" className="text-blue-950  hover:text-indigo-500">
            Don’t have an account? Sign up
          </Link>
          <button className="text-blue-950  hover:text-indigo-500">
            Forgot password? Reset password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
