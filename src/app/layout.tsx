import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Providers from "@/context/provider";
import Navbar from "@/components/navbar";
import { RedditsProvider } from "@/context/redditsContext";
import { Toaster } from "react-hot-toast";

const roboto = Ubuntu({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reddit - Dive into anything",
  description: "Share with your community",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          "box-border h-screen bg-background text-text",
          roboto.className,
        )}
      >
        <Providers>
          <RedditsProvider>
            <Navbar />
            <div className="flex justify-center">{children}</div>
          </RedditsProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
