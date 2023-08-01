import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import ToggleDarkMode from "@/components/toggleDarkMode";
import { HomeIcon, PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

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
        className={`${roboto.className} box-border bg-background text-text`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center gap-2 bg-white py-2 dark:bg-black dark:text-white sm:gap-3 md:gap-5">
      <Logo />
      <SearchBar />
      <NavLink href="/post">
        <PlusIcon width={30} height={30} />
      </NavLink>
      <ToggleDarkMode />
    </nav>
  );
};

const SearchBar = () => {
  return (
    <div className="flex flex-row rounded-full border border-gray-500 bg-gray-100 py-1">
      <MagnifyingGlassIcon width={30} height={30} className="pl-1 opacity-50" />
      <input
        type="text"
        className="left-5 w-full rounded-full bg-gray-100 px-2 text-xs outline-none"
        placeholder="Search"
      />
    </div>
  );
};

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2">
      <Image
        src="/logo.svg"
        width={40}
        height={40}
        alt="reddit logo"
        className="min-w-[1.75rem]"
      />
      <Image
        src="/logo_text.svg"
        width={65}
        height={40}
        alt="reddit logo"
        className="hidden md:block"
      />
    </Link>
  );
};

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => {
  return (
    <Link
      className="rounded-md p-1 text-center shadow transition-all duration-75 hover:bg-gray-100"
      href={href}
    >
      {children}
    </Link>
  );
};
