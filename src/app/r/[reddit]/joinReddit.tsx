"use client";

import { useReddits } from "@/context/redditsContext";
import Reddit from "@/types/reddit";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const joinReddit = ({
  redditId,
  className,
}: {
  redditId: number;
  className?: string;
}) => {
  const [isMember, setIsMember] = useState(false);
  const { reddits, setReddits } = useReddits();
  const lastState = useRef(false);

  useEffect(() => {
    setIsMember(!!reddits.find((r) => r.redditId == redditId));
  }, [reddits]);

  const toggleJoin = () => {
    lastState.current = isMember;
    setIsMember(!isMember);

    fetch("/api/r/join", {
      method: "POST",
      body: JSON.stringify({
        redditId,
        isJoining: !isMember,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((r: Reddit) => {
        if (isMember) {
          setReddits((reddits) =>
            reddits.filter((r) => r.redditId != redditId),
          );
          toast.success(`Successfully left r/${r.name}!`, {
            position: "bottom-right",
          });
        } else {
          setReddits([
            ...reddits,
            { redditId, reddit: r.name, imageId: r.imageId },
          ]);
          toast.success(`Successfully joined r/${r.name}!`, {
            position: "bottom-right",
          });
        }
      })
      .catch(() => {
        toast.error(
          `An error ocurred ${
            lastState.current ? "leaving" : "joining"
          } reddit`,
          { position: "bottom-right" },
        );
        setIsMember(lastState.current);
      });
  };

  return (
    <button
      onClick={() => toggleJoin()}
      className={twMerge(
        "group min-w-[5rem] rounded-3xl border-2 border-blue-500 py-[0.15rem] text-xs font-bold",
        className,
        isMember
          ? "bg-white text-blue-500 hover:bg-gray-100/50"
          : "bg-blue-500 text-white hover:border-blue-400 hover:bg-blue-400",
      )}
    >
      <span className="inline group-hover:hidden">
        {" "}
        {isMember ? "Joined" : "Join"}{" "}
      </span>
      <span className="hidden group-hover:inline">
        {" "}
        {isMember ? "Leave" : "Join"}{" "}
      </span>
    </button>
  );
};

export default joinReddit;
