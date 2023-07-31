import Post from "@/types/post";
import Reddit from "@/types/reddit";
import Link from "next/link";

interface PropsPosts {
  posts: Post[];
  reddit?: Reddit;
}

const Posts = (props: PropsPosts) => {
  if (props.posts.length == 0) {
    return <h1>xd</h1>;
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-secondary p-5">
      {props.posts &&
        props.posts.map((post: Post) => (
          <div
            key={post.id}
            className="w-full min-w-fit rounded border border-black bg-background p-2"
          >
            <div className="flex items-center gap-3">
              <h1 className="mb-2 text-xl">{post.title}</h1>
              <Link
                className="text-xs hover:underline"
                href={`u/${post.username}`}
              >
                u/{post.username}
              </Link>

              {props.reddit ? (
                ""
              ) : (
                <Link
                  className="text-xs hover:underline"
                  href={`r/${post.reddit}`}
                >
                  r/{post.reddit}
                </Link>
              )}

              <h1 className="group relative text-xs">
                <span className="absolute bottom-6 hidden w-auto bg-black p-1 text-xs text-white opacity-90 group-hover:block">
                  {post.created_at.toLocaleString()}
                </span>
                {timeAgo(post.created_at)}
              </h1>
            </div>
            <p>{post.content}</p>
            <h1>{post.upvotes}</h1>
            <h1>{post.downvotes}</h1>
          </div>
        ))}
    </div>
  );
};

export default Posts;

function timeAgo(created_at: Date | string): string {
  let date: Date;
  if (typeof created_at == "string") {
    date = new Date(created_at);
  } else {
    date = created_at;
  }
  const ms = new Date().getTime() - date.getTime();
  const seconds = ms / 1000;
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
