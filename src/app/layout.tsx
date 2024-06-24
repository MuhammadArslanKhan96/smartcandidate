"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import VoiceContextProvider from "@/context/VoiceContext";
import { AuthContextProvider } from "@/context/AuthContext";

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
          <VoiceContextProvider>
            <AuthContextProvider>
              {children}
              <ScrollToTop />
            </AuthContextProvider>
          </VoiceContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
