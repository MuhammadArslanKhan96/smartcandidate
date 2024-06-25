"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import VoiceContextProvider from "@/context/VoiceContext";
import { AuthContextProvider } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import TranslationContextProvider from "@/context/TranslationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">
      <head />

      <body>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <TranslationContextProvider>
            <VoiceContextProvider>
              <AuthContextProvider>
                <Loading />
                {children}
                <ScrollToTop />
              </AuthContextProvider>
            </VoiceContextProvider>
          </TranslationContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
