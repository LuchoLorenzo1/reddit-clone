"use client";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface removeRedditProps {
  redditId: number;
}

const removeReddit: FC<removeRedditProps> = ({ redditId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    fetch(`/api/r/${redditId}`, { method: "DELETE" })
      .then(() => router.push("/"))
      .catch((e) => console.log("(toast)", e))
      .finally(() => setLoading(false));
  };

  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-red-500 px-2 py-1 text-center text-sm font-bold text-red-500"
    >
      {loading ? <Spinner /> : <h3>Remove reddit</h3>}
    </button>
  );
};

export default removeReddit;
