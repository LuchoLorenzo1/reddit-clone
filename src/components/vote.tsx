"use client";
import { FC, useState, useRef } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

interface VoteProps {
  downvotes: number;
  upvotes: number;
  isUpvote?: boolean;
  postId: number;
}

const Vote: FC<VoteProps> = ({ upvotes, downvotes, isUpvote, postId }) => {
  const alreadyVoted = isUpvote == undefined ? 0 : isUpvote ? 1 : -1;
  const [vote, createVote] = useVote(isUpvote, postId);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <ArrowButton
        onClick={() => createVote(1)}
        className={twMerge(
          "fill-none stroke-gray-400 stroke-[5] group-hover:stroke-orange-500",
          vote == 1 ? "fill-orange-500 stroke-orange-500" : "",
        )}
      />
      <h1
        className={twMerge(
          "font-bold",
          vote == 1 ? "text-orange-500" : "",
          vote == -1 ? "text-blue-500" : "",
        )}
      >
        {upvotes - downvotes + vote - alreadyVoted}
      </h1>
      <ArrowButton
        onClick={() => createVote(-1)}
        className={twMerge(
          "rotate-180 fill-none stroke-gray-400 stroke-[5] group-hover:stroke-blue-500",
          vote == -1 ? "fill-blue-500 stroke-blue-500" : "",
        )}
      />
    </div>
  );
};

type VoteType = 0 | 1 | -1;
type useVoteReturn = [VoteType, (newVote: VoteType) => void];

const useVote = (
  isUpvote: boolean | undefined,
  postId: number,
): useVoteReturn => {
  const [vote, setVote] = useState<VoteType>(
    isUpvote == undefined ? 0 : isUpvote ? 1 : -1,
  );
  const lastVote = useRef<VoteType>(0);

  const createVote = (newVote: VoteType) => {
    lastVote.current = vote;
    if (vote == newVote) newVote = 0;

    setVote(newVote);
    fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({
        postId,
        vote: newVote,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
      })
      .catch(() => {
        toast.error("An error ocurred voting the post", {
          position: "bottom-right",
        });
        setVote(lastVote.current);
      });
  };

  return [vote, createVote];
};

export default Vote;

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ArrowButton: FC<ArrowButtonProps> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group rounded-sm px-1 py-1 hover:bg-background/70 focus:bg-background/60 focus:outline-none hover:focus:bg-background/90"
    >
      <svg
        className={className}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 60.731 60.731"
      >
        <g>
          <g>
            <polygon points="30.366,0 0.625,29.735 17.998,29.735 18.003,60.731 42.733,60.729 42.733,29.735 60.107,29.735" />
          </g>
        </g>
      </svg>
    </button>
  );
};
