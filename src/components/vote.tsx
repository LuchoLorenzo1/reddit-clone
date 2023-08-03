"use client";
import { FC, useEffect, useState, useReducer } from "react";
import { twMerge } from "tailwind-merge";

interface VoteProps {
  downvotes: number;
  upvotes: number;
  isUpvote?: boolean;
  postId: number;
}

const Vote: FC<VoteProps> = ({ upvotes, downvotes, isUpvote, postId }) => {
  const [votes, upVote, downVote, isVoted, isUpvoted] = useVote(
    upvotes,
    downvotes,
    isUpvote,
    postId,
  );

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <ArrowButton
        onClick={() => upVote()}
        className={twMerge(
          "fill-none stroke-gray-400 stroke-[5] group-hover:stroke-orange-500",
          isVoted && isUpvoted ? "fill-orange-500 stroke-orange-500" : "",
        )}
      />
      <h1
        className={twMerge(
          "font-bold",
          isVoted && isUpvoted ? "text-orange-500" : "",
          isVoted && !isUpvoted ? "text-blue-500" : "",
        )}
      >
        {votes}
      </h1>
      <ArrowButton
        onClick={() => downVote()}
        className={twMerge(
          "rotate-180 fill-none stroke-gray-400 stroke-[5] group-hover:stroke-blue-500",
          isVoted && !isUpvoted ? "fill-blue-500 stroke-blue-500" : "",
        )}
      />
    </div>
  );
};

type useVoteReturn = [number, () => void, () => void, boolean, boolean];

const useVote = (
  upvotes: number,
  downvotes: number,
  isUpvote: boolean | undefined,
  postId: number,
): useVoteReturn => {
  const [isVoted, setVoted] = useState(isUpvote != undefined);
  const [isUpvoted, setUpvoted] = useState(!!isUpvote);
  const [votes, setVotes] = useState(upvotes - downvotes);

  const upVote = () => {
    if (isVoted && isUpvoted) {
      return sendVote(0, postId).then(() => {
        setVotes(votes - 1);
        setVoted(false);
        setUpvoted(false);
      });
    }
    sendVote(1, postId).then(() => {
      if (isVoted && !isUpvoted) {
        setVotes(votes + 2);
      } else {
        setVotes(votes + 1);
      }
      setVoted(true);
      setUpvoted(true);
    });
  };

  const downVote = () => {
    if (isVoted && !isUpvoted) {
      return sendVote(0, postId).then(() => {
        setVotes(votes + 1);
        setVoted(false);
        setUpvoted(false);
      });
    }

    sendVote(-1, postId).then(() => {
      if (isVoted && isUpvoted) {
        setVotes(votes - 2);
      } else {
        setVotes(votes - 1);
      }
      setVoted(true);
      setUpvoted(false);
    });
  };

  return [votes, upVote, downVote, isVoted, isUpvoted];
};

export default Vote;

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ArrowButton: FC<ArrowButtonProps> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group rounded-sm px-1 py-1  hover:bg-gray-200 focus:bg-gray-200 focus:outline-none hover:focus:bg-gray-300"
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

const sendVote = (vote: number, postId: number) => {
  return fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify({
      postId,
      vote,
    }),
  });
};
