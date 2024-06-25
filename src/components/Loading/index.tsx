"use client";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";

export default function Loading() {
  const { loadingUser, user } = useAuthContext();

  if (user?.isFrozen && !user?.isAdmin) return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen flex items-center justify-center z-50 bg-gray-900 text-white">
      <div className="text-3xl font-bold">Bloqueado pelo Admin</div>
    </div>
  );

  if (!loadingUser) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen flex items-center justify-center z-50 bg-gray-900 text-white">
      <div className="animate-pulse text-3xl font-bold">Loading...</div>
    </div>
  )

}