"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

const joinReddit = ({
  isMember,
  redditId,
}: {
  isMember: boolean;
  redditId: number;
}) => {
  const [member, setMember] = useState(isMember);

  const toggleJoin = () => {
    fetch("/api/r/join", {
      method: "POST",
      body: JSON.stringify({
        redditId,
        isJoining: !member,
      }),
    }).then((res) => (res.ok ? setMember(!member) : ""));
  };

  return (
    <button
      onClick={() => toggleJoin()}
      className={twMerge(
        "group min-w-[5rem] rounded-3xl border-2 border-blue-500 py-[0.15rem] text-xs font-bold",
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
