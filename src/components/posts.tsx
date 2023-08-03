import Post from "@/types/post";
import Reddit from "@/types/reddit";
import { timeAgo } from "@/utils/time";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import Vote from "./vote";
import { TimeSpan } from "./TimeSpan";

interface PropsPosts {
  posts: Post[];
  reddit?: Reddit;
}

const Posts: FC<PropsPosts> = ({ posts, reddit }) => {
  return (
    <div className="flex flex-col gap-2">
      {posts &&
        posts.map((post: Post) => (
          <PostComponent key={post.id} post={post} reddit={reddit} />
        ))}
    </div>
  );
};

interface PropsPost {
  post: Post;
  reddit?: Reddit;
}

const PostComponent: FC<PropsPost> = ({ post, reddit }) => {
  return (
    <div className="min-w-fit rounded-sm border border-gray-400 bg-white hover:border-black">
      <div className="flex h-full w-full">
        <div className="rounded-l-sm bg-gray-50 px-1 py-2">
          <Vote
            downvotes={post.downvotes}
            upvotes={post.upvotes}
            isUpvote={post.isUpvote}
            postId={post.id}
          />
        </div>

        <div className="w-full rounded-sm px-2 pb-1 hover:text-opacity-100">
          <div className="flex flex-col">
            <PostNavbar post={post} reddit={reddit} />
            <h1 className="mb-1 text-xl">{post.title}</h1>
          </div>
          <p className="text-sm">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Posts;

interface PostNavbarProps {
  post: Post;
  reddit?: Reddit;
}

const PostNavbar: FC<PostNavbarProps> = ({ post, reddit }) => {
  return (
    <div className="flex gap-2 pt-1">
      {reddit ? (
        ""
      ) : (
        <>
          <Image
            className="rounded-full"
            src="/devsarg.png"
            width={20}
            height={20}
            alt="profile picture"
          />
          <Link className="text-xs hover:underline" href={`r/${post.reddit}`}>
            r/{post.reddit}
          </Link>
        </>
      )}

      <Link className="text-xs hover:underline" href={`u/${post.username}`}>
        u/{post.username}
      </Link>

      <h1 className="group relative text-xs">
        <TimeSpan date={post.created_at} />
        {timeAgo(post.created_at)}
      </h1>
    </div>
  );
};
