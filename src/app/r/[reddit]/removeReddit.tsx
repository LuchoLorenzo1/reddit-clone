"use client";
import Spinner from "@/components/spinner";
import { useReddits } from "@/context/redditsContext";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface removeRedditProps {
  redditId: number;
}

const removeReddit: FC<removeRedditProps> = ({ redditId }) => {
  const router = useRouter();
  const { setReddits } = useReddits();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    fetch(`/api/r/${redditId}`, { method: "DELETE" })
      .then(() => router.push("/"))
      .catch((e) => console.log("(toast)", e))
      .finally(() => {
        setLoading(false);
        setReddits((reddits) => reddits.filter((r) => r.redditId != redditId));
      });
  };

  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-red-500 px-2 py-1 text-center text-sm font-bold text-red-500"
    >
      {loading ? (
        <Spinner className="h-4 w-4 border-red-500" />
      ) : (
        <h3>Remove reddit</h3>
      )}
    </button>
  );
};

export default removeReddit;
