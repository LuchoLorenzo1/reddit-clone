"use client";
import Post from "@/types/post";
import { ChatBubbleIcon, Share1Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FC, useState } from "react";
import Dialog, { modalProps } from "../dialog";
import Spinner from "../spinner";

interface PostFooterProps {
  post: Post;
  deletePost: (postId: number) => Promise<void>;
}

export interface removePostProps {
  postId: number;
  deletePost: (postId: number) => Promise<void>;
}

const PostFooter: FC<PostFooterProps> = ({ post, deletePost }) => {
  return (
    <div className="align-center flex gap-2 text-gray-500">
      <Link
        href={`post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-background-300 hover:text-text"
      >
        <ChatBubbleIcon
          width={20}
          height={20}
          className="group-hover:text-text"
        />
        <h3 className="text-xs">{`${post.comments} Comments`}</h3>
      </Link>
      <Link
        href={`/post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-background-300 hover:text-text"
      >
        <Share1Icon width={20} height={20} className="group-hover:text-text" />
        <h3 className="text-xs">Share</h3>
      </Link>
      <div>
        <Dialog<removePostProps>
          Modal={removePost}
          modalProps={{ postId: post.id, deletePost }}
          modalClassName="max-w-xs text-center p-3 bg-background-100"
        >
          <div className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-background-300 hover:text-red-500">
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
        className="w-auto rounded-full bg-red-500 p-4 py-[0.15rem] text-center text-sm font-bold text-white transition hover:bg-red-600 focus:bg-red-800 focus:outline-none focus:hover:bg-red-900"
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

export default PostFooter;
