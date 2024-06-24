"use client";
import axios from "axios";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

const VoiceContext = createContext({
  voices: [],
  voicesLoading: true,
});

export default function VoiceContextProvider({ children }: { children: ReactNode }) {
  const [voices, setVoices] = useState([]);
  const [voicesLoading, setVoicesLoading] = useState(true);

  const getVoices = useCallback(async () => {
    setVoicesLoading(true);
    const { voices } = await axios.get("https://api.elevenlabs.io/v1/voices").then(r => r.data);
    setVoices(voices);
    setVoicesLoading(false);
  }, [])

  useEffect(() => {
    getVoices();
  }, []);

  return (
    <VoiceContext.Provider value={{ voices, voicesLoading }}>{children}</VoiceContext.Provider>
  )
}

export const useVoicesContext = () => useContext(VoiceContext);