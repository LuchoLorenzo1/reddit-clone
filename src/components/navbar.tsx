import Link from "next/link";
import Image from "next/image";
import ToggleDarkMode from "@/components/toggleDarkMode";
import { twMerge } from "tailwind-merge";
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ReactNode } from "react";
import Navigator from "./navigator";

import { getUserById } from "@/controllers/users";
import User from "@/types/user";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  let user: User | undefined;
  if (session) user = await getUserById(session.user.id);

  return (
    <nav className="flex items-center justify-center gap-2 bg-white px-2 py-2 dark:bg-black dark:text-white sm:gap-3 md:gap-5">
      <Logo />
      <Navigator />
      <SearchBar />
      <NavLink href="/post">
        <PlusIcon width={30} height={30} />
      </NavLink>
      <ToggleDarkMode />
      {session ? (
        <Link href="/edit">
          <Image
            src={
              user?.imageId
                ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${user.imageId}`
                : session.user?.image ?? "/r.svg"
            }
            width={40}
            height={40}
            alt="profile picture"
            className="min-w-[1.75rem] rounded-full hover:opacity-50"
          />
        </Link>
      ) : (
        <NavLink className="min-w-fit px-2" href="/signin">
          Sign In
        </NavLink>
      )}
    </nav>
  );
};

const SearchBar = () => {
  return (
    <div className="flex w-full max-w-md flex-row rounded-full border border-gray-500 bg-gray-100 py-1">
      <MagnifyingGlassIcon width={30} height={30} className="pl-1 opacity-50" />
      <input
        type="text"
        className="left-5 w-full rounded-full bg-gray-100 px-2 text-xs outline-none"
        placeholder="Search Reddit"
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
      <LogoText />
    </Link>
  );
};

const NavLink = ({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      className={twMerge(
        "rounded-md p-1 text-center shadow transition-all duration-75 hover:bg-gray-100",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

const LogoText = () => (
  <svg
    className="hidden md:block"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 57 18"
    width="60"
  >
    <g className="fill-black dark:fill-white">
      <path d="M54.63 16.52V7.68h1a1 1 0 0 0 1.09-1v-.03a1 1 0 0 0-.93-1.12h-1.16V3.88a1.23 1.23 0 0 0-1.12-1.23 1.2 1.2 0 0 0-1.27 1.11v1.79h-1a1 1 0 0 0-1.09 1v.07a1 1 0 0 0 .93 1.12h1.13v8.81a1.19 1.19 0 0 0 1.19 1.19 1.19 1.19 0 0 0 1.25-1.12.17.17 0 0 0-.02-.1Z" />
      <circle cx={47.26} cy={3.44} r={2.12} fill="#FF4500" />
      <path d="M48.44 7.81a1.19 1.19 0 1 0-2.38 0v8.71a1.19 1.19 0 0 0 2.38 0ZM30.84 1.19A1.19 1.19 0 0 0 29.65 0a1.19 1.19 0 0 0-1.19 1.19v5.32a4.11 4.11 0 0 0-3-1.21c-3.1 0-5.69 2.85-5.69 6.35S22.28 18 25.42 18a4.26 4.26 0 0 0 3.1-1.23 1.17 1.17 0 0 0 1.47.8 1.2 1.2 0 0 0 .85-1.05Zm-5.43 14.45c-1.83 0-3.32-1.77-3.32-4s1.48-4 3.32-4 3.31 1.78 3.31 4-1.47 3.95-3.3 3.95ZM43.28 1.19A1.19 1.19 0 0 0 42.09 0a1.18 1.18 0 0 0-1.18 1.19v5.32a4.15 4.15 0 0 0-3-1.21c-3.1 0-5.69 2.85-5.69 6.35S34.72 18 37.86 18A4.26 4.26 0 0 0 41 16.77a1.17 1.17 0 0 0 1.47.8 1.19 1.19 0 0 0 .85-1.05Zm-5.43 14.45c-1.83 0-3.31-1.77-3.31-4s1.47-4 3.31-4 3.31 1.78 3.31 4-1.47 3.95-3.3 3.95ZM17.27 12.44a1.49 1.49 0 0 0 1.59-1.38v-.15a4.81 4.81 0 0 0-.1-.85 5.83 5.83 0 0 0-5.51-4.76c-3.1 0-5.69 2.85-5.69 6.35S10.11 18 13.25 18a5.66 5.66 0 0 0 4.39-1.84 1.23 1.23 0 0 0-.08-1.74l-.11-.09a1.29 1.29 0 0 0-1.58.17 3.91 3.91 0 0 1-2.62 1.12A3.54 3.54 0 0 1 10 12.44h7.27Zm-4-4.76a3.41 3.41 0 0 1 3.09 2.64h-6.22a3.41 3.41 0 0 1 3.1-2.64ZM7.68 6.53a1.19 1.19 0 0 0-1-1.18 4.56 4.56 0 0 0-4.29 1.56v-.16a1.2 1.2 0 0 0-2.39 0v9.77a1.23 1.23 0 0 0 1.12 1.24 1.19 1.19 0 0 0 1.26-1.1.66.66 0 0 0 0-.14v-5A3.62 3.62 0 0 1 5.81 7.7a4.87 4.87 0 0 1 .54 0h.24a1.18 1.18 0 0 0 1.09-1.17Z" />
    </g>
  </svg>
);

export default Navbar;
