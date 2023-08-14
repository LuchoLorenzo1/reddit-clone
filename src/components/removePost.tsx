"use client";
import Spinner from "@/components/spinner";
import { FC, useState } from "react";
import { modalProps } from "./dialog";

export interface removePostProps {
  postId: number;
}

const removePost: FC<modalProps<removePostProps>> = ({ setOpen, props }) => {
  if (!props) return;

  const [loading, setLoading] = useState(false);

  const deletePost = () => {
    setLoading(true);
    fetch(`/api/post/${props.postId}`, { method: "DELETE" })
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
        onClick={deletePost}
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

export default removePost;
