"use client";
import Spinner from "@/components/spinner";
import { useReddits } from "@/context/redditsContext";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface removeRedditProps {
  redditId: number;
  redditName: string;
  className: string;
}

const removeReddit: FC<removeRedditProps> = ({
  redditName,
  redditId,
  className,
}) => {
  const router = useRouter();
  const { setReddits } = useReddits();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    fetch(`/api/r/${redditId}`, { method: "DELETE" })
      .then(() => {
        toast.success(`Succesfully deleted ${redditName}`);
        setReddits((reddits) => reddits.filter((r) => r.redditId != redditId));
        router.push("/");
      })
      .catch(() => toast.error(`An error ocurred deleting ${redditName}`))
      .finally(() => setLoading(false));
  };

  return (
    <button onClick={onClick} className={className}>
      {loading ? (
        <Spinner className="h-4 w-4 border-red-500" />
      ) : (
        <h3>Remove r/{redditName}</h3>
      )}
    </button>
  );
};

export default removeReddit;
