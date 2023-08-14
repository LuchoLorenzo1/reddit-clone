import Post from "@/types/post";
import Reddit from "@/types/reddit";
import { timeAgo } from "@/utils/time";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import Vote from "./vote";
import { TimeSpan } from "./timeSpan";
import { TrashIcon, ChatBubbleIcon, Share1Icon } from "@radix-ui/react-icons";
import Dialog from "./dialog";
import removePost, { removePostProps } from "./removePost";

interface PropsPosts {
  posts?: Post[];
  reddit?: Reddit;
}

const Posts: FC<PropsPosts> = ({ posts, reddit }) => {
  if (!posts || posts.length == 0) {
    return (
      <div className="flex justify-center">
        <h1>No posts</h1>
      </div>
    );
  }

  return (
    <div className="mb-2 flex flex-col gap-2">
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
    <div className="flex max-w-full rounded-sm border border-gray-400 bg-white">
      <section className="rounded-l-sm bg-gray-100 px-1 py-2">
        <Vote
          downvotes={post.downvotes}
          upvotes={post.upvotes}
          isUpvote={post.isUpvote}
          postId={post.id}
        />
      </section>

      <div className="relative max-w-full rounded-sm px-2 pb-1 hover:text-opacity-100">
        <PostNavbar post={post} reddit={reddit} />
        <PostContent post={post} />
        <PostFooter post={post} />
      </div>
    </div>
  );
};

interface PostContentProps {
  post: Post;
}

const PostContent: FC<PostContentProps> = ({ post }) => {
  return (
    <Link href={`post/${post.id}`} className="max-w-full overflow-hidden">
      {post.imageId ? (
        <div className="relative flex flex-col items-center justify-center">
          <h1 className="text-md mb-2 mt-1 max-h-10 w-full overflow-clip break-all">
            {post.title}
          </h1>
          <Image
            src={`https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.imageId}`}
            loading="lazy"
            width={1500}
            height={1500}
            alt="post picture"
            className="h-auto max-h-80 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="max-h-40 overflow-clip break-all">
          <h1 className="text-md mb-2 mt-1 w-full">{post.title}</h1>
          <p className="text-xs">{post.content}</p>
        </div>
      )}
    </Link>
  );
};

export default Posts;

interface PostNavbarProps {
  post: Post;
  reddit?: Reddit;
}

const PostNavbar: FC<PostNavbarProps> = ({ post, reddit }) => {
  return (
    <div className="flex w-full max-w-full items-center gap-1 overflow-hidden pt-1 text-[0.5rem] text-gray-500 sm:gap-2 sm:text-xs">
      {reddit ? (
        ""
      ) : (
        <>
          <Image
            className="rounded-full"
            src={
              post.redditImageId
                ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.redditImageId}`
                : "/r.svg"
            }
            width={20}
            height={20}
            loading="lazy"
            alt="profile picture"
          />
          <Link
            className="max-w-[8rem] overflow-hidden overflow-ellipsis hover:underline"
            href={`r/${post.reddit}`}
          >
            r/{post.reddit}
          </Link>
        </>
      )}

      <Link
        className="max-w-[8rem] overflow-hidden overflow-ellipsis hover:underline"
        href={`u/${post.username}`}
      >
        u/{post.username}
      </Link>

      <div className="group relative hover:text-opacity-90">
        <TimeSpan date={post.created_at} />
        <h1 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
          {timeAgo(post.created_at)}
        </h1>
      </div>
    </div>
  );
};

interface PostFooterProps {
  post: Post;
}

const PostFooter: FC<PostFooterProps> = ({ post }) => {
  return (
    <div className="align-center flex gap-2 pt-1 text-gray-500">
      <Link
        href={`post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-gray-700"
      >
        <ChatBubbleIcon
          width={20}
          height={20}
          className="group-hover:text-gray-700"
        />
        <h3 className="text-xs">{`${post.comments} Comments`}</h3>
      </Link>
      <Link
        href={`post/${post.id}`}
        className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-gray-700"
      >
        <Share1Icon
          width={20}
          height={20}
          className="group-hover:text-gray-700"
        />
        <h3 className="text-xs">Share</h3>
      </Link>
      <div>
        <Dialog<removePostProps>
          Modal={removePost}
          modalProps={{ postId: post.id }}
          modalClassName="max-w-xs text-center"
        >
          <div className="align-center group flex w-auto gap-1 rounded p-1 text-sm hover:bg-gray-200 hover:text-red-500">
            <TrashIcon
              width={20}
              height={20}
              className="gray-400 group-hover:text-red-500"
            />
            <h3 className="text-xs">Remove</h3>
          </div>
        </Dialog>
      </div>
    </div>
  );
};
