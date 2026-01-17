import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import "./globals.css";
import {
  ClerkProvider

} from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CourseCraft AI - AI-Powered Course Generator",
  description: "Transform any topic into a complete video course with AI. Learn smarter, faster, and more effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} font-sans antialiased`}
      >
        <Provider>
        {children}
        <Toaster position="top-center" richColors />
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}
