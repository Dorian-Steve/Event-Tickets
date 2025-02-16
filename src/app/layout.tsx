"use client"

import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convixClientProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SyncUserWithConvex from "@/components/shared/SyncUserWithConvex";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <ConvexClientProvider>
          <ClerkProvider>
            <Navbar />
            <SyncUserWithConvex />
            {children}
            <Toaster />
            <Footer />
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
