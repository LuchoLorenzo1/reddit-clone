"use client";

import Post from "@/types/post";
import { FC, useEffect, useRef, useState } from "react";
import Vote from "./vote";
import { useRedditData } from "@/context/redditDataContext";
import toast from "react-hot-toast";
import PostNavbar from "./postNavbar";
import PostContent from "./postContent";
import PostFooter from "./postFooter";
import LoadingPost from "./loadingPost";
import Link from "next/link";

const SCROLL_SIZE = 5;

const Posts: FC = () => {
  const { posts, setPosts, observerTarget, loading, scrollEnd } =
    useInfiniteScrolling();

  const deletePost = async (postId: number) => {
    await fetch(`/api/post/${postId}`, { method: "DELETE" })
      .then(() => {
        setPosts((_posts) => _posts.filter((p) => p.id != postId));
        toast.success("Post removed succesfully", {
          position: "bottom-right",
          duration: 2000,
        });
      })
      .catch(() => {
        toast.error("An error ocurred removing post", {
          position: "bottom-right",
          duration: 2000,
        });
      });
  };

  return (
    <div className="mb-2 flex flex-col gap-2">
      {posts.length > 0 &&
        posts.map((post: Post) => (
          <div
            key={post.id}
            className="flex max-w-full rounded-sm border border-background hover:border-background-300"
          >
            <section className="flex flex-col items-center justify-start rounded-l-sm bg-background-300 px-1 py-2 text-center">
              <Vote
                downvotes={post.downvotes}
                upvotes={post.upvotes}
                isUpvote={post.isUpvote}
                postId={post.id}
              />
            </section>

            <div className="relative w-full max-w-full rounded-r-sm bg-background-100 px-2 pb-1 hover:text-opacity-100">
              <section className="flex w-full max-w-full items-center gap-1 pt-1 text-[0.5rem] text-gray-500 sm:gap-2 sm:text-xs">
                <PostNavbar post={post} />
              </section>
              <Link
                href={`/post/${post.id}`}
                className="w-full max-w-full overflow-hidden"
              >
                <PostContent post={post} />
              </Link>
              <section className="flex items-center gap-2 text-gray-500">
                <PostFooter post={post} deletePost={deletePost} />
              </section>
            </div>
          </div>
        ))}
      {loading ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        ""
      )}
      {scrollEnd ? (
        <div className="mt-2 flex w-full items-center justify-center gap-2">
          {" "}
          <h1>It looks like you reached the end!</h1>{" "}
          <button
            className="rounded-md bg-primary px-2 py-1 text-sm font-bold text-background hover:bg-primary/80"
            onClick={() => window.scrollTo(0, 0)}
          >
            Go back Up
          </button>{" "}
        </div>
      ) : (
        <div ref={observerTarget} />
      )}
    </div>
  );
};

const useInfiniteScrolling = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(-SCROLL_SIZE);
  const [page, setPage] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);
  const reddit = useRedditData();

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? setPage((p) => p + 1) : ""),
      { threshold: 0 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget]);

  useEffect(() => {
    if (scrollEnd || loading) return;

    setLoading(true);
    fetch(
      `/api/post?offset=${offset + SCROLL_SIZE}&limit=${SCROLL_SIZE}${
        reddit ? `&r=${reddit?.id}` : ""
      }`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          if (data.posts.length < SCROLL_SIZE) setScrollEnd(true);
          setPosts([...posts, ...data.posts]);
          setOffset(offset + SCROLL_SIZE);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  return { posts, setPosts, observerTarget, loading, scrollEnd };
};

export default Posts;
