import { FC } from "react";

interface VoteProps {
  downvotes: number;
  upvotes: number;
}

const Vote: FC<VoteProps> = ({ upvotes, downvotes }) => {
  return (
    <>
      <button>↑</button>
      <h1>{upvotes - downvotes}</h1>
      <button>↓</button>
    </>
  );
};

export default Vote;
