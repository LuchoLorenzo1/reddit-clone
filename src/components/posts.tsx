"use client";

import Post from "@/types/post";
import { timeAgo } from "@/utils/time";
import Link from "next/link";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import Vote from "./vote";
import { TimeSpan } from "./timeSpan";
import { TrashIcon, ChatBubbleIcon, Share1Icon } from "@radix-ui/react-icons";
import Dialog, { modalProps } from "./dialog";
import { useRedditData } from "@/context/redditDataContext";
import Spinner from "./spinner";
import toast from "react-hot-toast";

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
            className="flex max-w-full rounded-sm border border-gray-400 bg-white"
          >
            <section className="rounded-l-sm bg-gray-100 px-1 py-2">
              <Vote
                downvotes={post.downvotes}
                upvotes={post.upvotes}
                isUpvote={post.isUpvote}
                postId={post.id}
              />
            </section>

            <div className="relative w-full max-w-full rounded-sm px-2 pb-1 hover:text-opacity-100">
              <PostNavbar post={post} />
              <PostContent post={post} />
              <PostFooter post={post} deletePost={deletePost} />
            </div>
          </div>
        ))}
      <div className="flex w-full justify-center">
        {loading ? <Spinner /> : ""}
        {scrollEnd ? (
          <h1>No more posts</h1>
        ) : (
          <div className="h-5" ref={observerTarget}></div>
        )}
      </div>
    </div>
  );
};

interface PostContentProps {
  post: Post;
}

const PostContent: FC<PostContentProps> = ({ post }) => {
  return (
    <Link
      href={`/post/${post.id}`}
      className="w-full max-w-full overflow-hidden bg-red-200"
    >
      {post.imageId ? (
        <div className="relative mb-2 flex flex-col items-center justify-center">
          <h1 className="text-md mt-1 max-h-10 w-full overflow-clip break-all">
            {post.title}
          </h1>
          <Image
            src={`https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.imageId}`}
            loading="lazy"
            width={1500}
            height={1500}
            alt="post picture"
            priority={false}
            className="h-auto max-h-80 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="max-h-40 w-full overflow-clip break-all">
          <h1 className="text-md my-1 w-full">{post.title}</h1>
          {post.content ? <p className="mb-1 text-xs">{post.content}</p> : ""}
        </div>
      )}
    </Link>
  );
};

export default Posts;

interface PostNavbarProps {
  post: Post;
}

const PostNavbar: FC<PostNavbarProps> = ({ post }) => {
  const reddit = useRedditData();
  return (
    <div className="flex w-full max-w-full items-center gap-1 pt-1 text-[0.5rem] text-gray-500 sm:gap-2 sm:text-xs">
      {reddit ? (
        ""
      ) : (
        <>
          <Image
            className="rounded-full"
            src={
              post.redditImageId
                ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.redditImageId}`
                : "/r.svg"
            }
            width={20}
            height={20}
            loading="lazy"
            alt="profile picture"
          />
          <Link
            className="max-w-[8rem] overflow-hidden overflow-ellipsis text-text hover:underline"
            href={`r/${post.reddit}`}
          >
            r/{post.reddit}
          </Link>
        </>
      )}
      <Link
        className="max-w-[8rem] overflow-hidden overflow-ellipsis hover:underline"
        href={`u/${post.username}`}
      >
        u/{post.username}
      </Link>
      <div className="group relative hover:text-opacity-90">
        <TimeSpan date={post.created_at} />
        <h1 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
          {timeAgo(post.created_at)}
        </h1>
      </div>
    </div>
  );
};

interface PostFooterProps {
  post: Post;
  deletePost: (postId: number) => Promise<void>;
}

const PostFooter: FC<PostFooterProps> = ({ post, deletePost }) => {
  return (
    <div className="align-center flex gap-2 text-gray-500">
      <Link
        href={`post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-gray-700"
      >
        <ChatBubbleIcon
          width={20}
          height={20}
          className="group-hover:text-gray-700"
        />
        <h3 className="text-xs">{`${post.comments} Comments`}</h3>
      </Link>
      <Link
        href={`/post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-gray-700"
      >
        <Share1Icon
          width={20}
          height={20}
          className="group-hover:text-gray-700"
        />
        <h3 className="text-xs">Share</h3>
      </Link>
      <div>
        <Dialog<removePostProps>
          Modal={removePost}
          modalProps={{ postId: post.id, deletePost }}
          modalClassName="max-w-xs text-center"
        >
          <div className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-red-500">
            <TrashIcon
              width={20}
              height={20}
              className="gray-400 group-hover:text-red-500"
            />
            <h3 className="text-xs">Remove</h3>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export interface removePostProps {
  postId: number;
  deletePost: (postId: number) => Promise<void>;
}

const removePost: FC<modalProps<removePostProps>> = ({ setOpen, props }) => {
  if (!props) return;

  const [loading, setLoading] = useState(false);

  const _deletePost = () => {
    setLoading(true);
    props
      .deletePost(props.postId)
      .then(() => (setOpen ? setOpen(false) : ""))
      .catch((e) => console.error("(toast)", e))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="text-balance flex max-w-xs flex-col gap-3">
      <h1>Are you sure you want to delete this post?</h1>
      <button
        onClick={() => _deletePost()}
        className="w-auto rounded-full border border-red-500 bg-white p-4 py-[0.15rem] text-center text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white focus:bg-gray-100 focus:outline-none"
      >
        {loading ? (
          <Spinner className="h-3 w-3 border-red-500" />
        ) : (
          "Remove Post"
        )}
      </button>
    </div>
  );
};

const useInfiniteScrolling = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);
  const reddit = useRedditData();
  const firstTime = useRef(true);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstTime.current && !scrollEnd) {
          setOffset((o) => o + SCROLL_SIZE);
        } else {
          firstTime.current = false;
        }
      },
      { threshold: 1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/post?offset=${offset}&limit=${SCROLL_SIZE}${
        reddit ? `&r=${reddit?.id}` : ""
      }`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          if (data.posts.length == 0) return setScrollEnd(true);
          setPosts([...posts, ...data.posts]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [offset]);

  return { posts, setPosts, observerTarget, loading, scrollEnd };
};
