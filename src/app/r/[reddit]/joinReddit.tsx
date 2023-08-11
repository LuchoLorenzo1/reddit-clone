"use client";

import { useReddits } from "@/context/redditsContext";
import Reddit from "@/types/reddit";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const joinReddit = ({
  isMember,
  redditId,
  className,
}: {
  isMember: boolean;
  redditId: number;
  className?: string;
}) => {
  const [member, setMember] = useState(isMember);
  const { reddits, setReddits } = useReddits();

  const toggleJoin = () => {
    fetch("/api/r/join", {
      method: "POST",
      body: JSON.stringify({
        redditId,
        isJoining: !member,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setMember(!member);
          return res.json();
        }
        throw new Error();
      })
      .then((r: Reddit) => {
        if (member) {
          setReddits((reddits) =>
            reddits.filter((r) => r.redditId != redditId),
          );
        } else {
          setReddits([
            ...reddits,
            { redditId, reddit: r.name, imageId: r.imageId },
          ]);
        }
      });
  };

  return (
    <button
      onClick={() => toggleJoin()}
      className={twMerge(
        "group min-w-[5rem] rounded-3xl border-2 border-blue-500 py-[0.15rem] text-xs font-bold",
        className,
        member
          ? "bg-white text-blue-500 hover:bg-gray-100/50"
          : "bg-blue-500 text-white hover:border-blue-400 hover:bg-blue-400",
      )}
    >
      <span className="inline group-hover:hidden">
        {" "}
        {member ? "Joined" : "Join"}{" "}
      </span>
      <span className="hidden group-hover:inline">
        {" "}
        {member ? "Leave" : "Join"}{" "}
      </span>
    </button>
  );
};

export default joinReddit;
