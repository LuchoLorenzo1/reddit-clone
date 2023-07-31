"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import Post from "@/types/post";
import Posts from "@/components/posts";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => {
    if (localStorage.theme && localStorage.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  useEffect(() => {
    if (localStorage.theme && localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }

    setError("");

    fetch("/api/post")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((res: any) => {
        console.log(res);
        setPosts(res.posts);
      })
      .catch((_) => setError("Error getting the posts"));
  }, []);

  return (
    <main className="text-balance flex flex-col items-center justify-center">
      <Navbar dark={dark} toggleDarkMode={toggleDarkMode} />

      {error ? (
        <h1 className="rounded bg-red-500 p-5">{error}</h1>
      ) : (
        <Posts posts={posts} />
      )}
    </main>
  );
}
// center absolute
// absolute top-1/2 left-1/2 transform -translate-x-2/4 -translate-y-2/4

interface NavbarProps {
  toggleDarkMode: CallableFunction;
  dark: boolean;
}

const Navbar = (props: NavbarProps) => {
  return (
    <nav className="mb-5 flex w-full items-center justify-center gap-5 bg-secondary p-3">
      <Link
        className="min-w-[8em] rounded-xl border border-primary py-1 text-center shadow transition-all duration-75 hover:bg-primary hover:text-background"
        href="/post"
      >
        POST
      </Link>

      <Link
        className="min-w-[8em] rounded-xl border border-primary py-1 text-center shadow transition-all duration-75 hover:bg-primary hover:text-background"
        href="/about"
      >
        ABOUT
      </Link>

      <button
        className="group rounded-full border border-primary p-2 shadow transition-all duration-75 hover:bg-primary hover:shadow-xl"
        onClick={() => props.toggleDarkMode()}
      >
        {props.dark ? (
          <SunIcon className="group transition-all duration-75 group-hover:text-background" />
        ) : (
          <MoonIcon className="group transition-all duration-75 group-hover:text-background" />
        )}
      </button>
    </nav>
  );
};
