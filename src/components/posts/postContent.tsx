import Post from "@/types/post";
import Image from "next/image";
import { FC } from "react";

interface PostContentProps {
  post: Post;
}

const PostContent: FC<PostContentProps> = ({ post }) => {
  if (post.imageId) {
    return (
      <div className="relative mb-2 flex flex-col items-center justify-center">
        <h1 className="text-md mt-1 max-h-10 w-full overflow-clip break-all">
          {post.title}
        </h1>
        <Image
          src={`https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.imageId}`}
          loading="lazy"
          width={1500}
          height={1500}
          alt="post picture"
          priority={false}
          className="h-auto max-h-80 max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="max-h-40 w-full overflow-clip break-all">
      <h1 className="text-md my-1 w-full">{post.title}</h1>
      {post.content ? <p className="mb-1 text-xs">{post.content}</p> : ""}
    </div>
  );
};

export default PostContent;
