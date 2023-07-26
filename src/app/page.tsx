"use client";
import DefaultCarousel from "@/components/accordeon";
import Card from "@/components/card";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Carousel } from "flowbite-react";

const toggleDarkMode = () => {
  if (localStorage.theme && localStorage.theme === "dark") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

interface Post {
  title?: string;
  content?: string;
  id?: number;
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.theme && localStorage.theme === "dark")
      document.documentElement.classList.add("dark");

    setError("");

    fetch("/api/post")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((res: any) => {
        setPosts(res.posts);
      })
      .catch((e) => setError("Error getting the posts"));
  }, []);

  return (
    <main className="text-balance m-5 flex flex-col items-center justify-center gap-5 font-mono">
      <button
        className="inset-auto rounded-xl border border-white bg-blue-300 px-5 py-2 dark:bg-stone-500"
        onClick={() => toggleDarkMode()}
      >
        TOGGLE
      </button>

      <Link
        className="inset-auto mb-5 rounded-xl border border-white bg-blue-300 px-5 py-2 dark:bg-stone-500"
        href="/post"
      >
        post
      </Link>

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

interface PropsPosts {
  posts: Post[];
}

const Posts = (props: PropsPosts) => {
  return (
    <div className="grid grid-cols-5 place-items-center gap-5 bg-slate-200 p-5 dark:bg-stone-500">
      {props.posts.map((post: Post, i) => (
        <div
          key={i}
          className="max-w-[6em] overflow-hidden rounded border border-black bg-blue-300 p-2 dark:border-white dark:bg-stone-800"
        >
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
