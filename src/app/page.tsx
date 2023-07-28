"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

interface Post {
	title: string;
	content: string;
	username: string;
	reddit: string;
}

export default function Home() {
	const [posts, setPosts] = useState([]);
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
				setPosts(res.posts);
			})
			.catch((_) => setError("Error getting the posts"));
	}, []);

	return (
		<main className="text-balance flex flex-col items-center justify-center">
			<nav className="flex gap-5 w-full justify-center items-center bg-secondary mb-5 p-3">
				<Link
					className="min-w-[8em] text-center rounded-xl border border-primary shadow hover:bg-primary hover:text-background py-1 transition-all duration-75"
					href="/post"
				>
					POST
				</Link>

				<Link
					className="min-w-[8em] text-center rounded-xl border border-primary shadow hover:bg-primary hover:text-background py-1 transition-all duration-75"
					href="/about"
				>
					ABOUT
				</Link>

				<button
					className="group rounded-full border border-primary shadow hover:shadow-xl p-2 hover:bg-primary transition-all duration-75"
					onClick={() => toggleDarkMode()}
				>
					{dark ? <SunIcon className="group group-hover:text-background transition-all duration-75" /> : <MoonIcon className="group group-hover:text-background transition-all duration-75" />}
				</button>
			</nav>

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
		<div className="flex flex-col gap-5 bg-secondary p-5 w-full md:m-5 mix-blend-darken">
			{props.posts.map((post: Post, i) => (
				<div
					key={i}
					className="w-full overflow-hidden rounded border border-black bg-background min-w-fit p-2"
				>
					<h1 className="text-center text-xl">{post.title}</h1>
					<h2>
						u/{post.username} • <Link href={`r/${post.reddit}`}>r/{post.reddit}</Link>
					</h2>
					<p>{post.content}</p>
				</div>
	))
}
		</div >
	);
};
