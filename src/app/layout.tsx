import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Providers from "@/context/Provider";
import Navbar from "@/components/navbar";

const roboto = Ubuntu({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reddit",
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
          <Navbar />
          <div className="flex justify-center">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
