import { useRedditData } from "@/context/redditDataContext";
import Post from "@/types/post";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/utils/time";
import { TimeSpan } from "../timeSpan";

interface PostNavbarProps {
  post: Post;
}

const PostNavbar: FC<PostNavbarProps> = ({ post }) => {
  const reddit = useRedditData();
  return (
    <>
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
            className="max-w-[8rem] overflow-hidden overflow-ellipsis text-text hover:underline"
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
    </>
  );
};

export default PostNavbar;
