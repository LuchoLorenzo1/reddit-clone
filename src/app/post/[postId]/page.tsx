"use client";

import PostNavbar from "@/components/posts/postNavbar";
import PostFooter from "@/components/posts/postFooter";
import Vote from "@/components/posts/vote";
import Post from "@/types/post";
import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostComment from "@/types/comments";
import { timeAgo } from "@/utils/time";

interface postPageProps {
  params: {
    postId: number;
  };
}

const postPage: FC<postPageProps> = ({ params }) => {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<PostComment[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/post/${params.postId}`)
      .then((res) => res.json())
      .then(({ post }) => {
        if (post) setPost(post);
      })
      .finally(() => setLoading(false));

    fetch(`/api/comment/${params.postId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.comments);
        if (data.comments) setComments([...comments, ...data.comments]);
      });
  }, []);

  return (
    <div className="mt-2 w-full max-w-4xl bg-background-100 p-2">
      {post && <FullPost post={post} />}
      <SubmitCommentForm setComments={setComments} postId={params.postId} />
      <div className="flex flex-col gap-2">
        {comments.map((c) => (
          <div key={c.id} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <h1>u/{c.username}</h1>
              <h1>{timeAgo(c.created_at)}</h1>
            </div>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubmitCommentForm = ({
  postId,
  setComments,
}: {
  postId: number;
  setComments: Dispatch<SetStateAction<PostComment[]>>;
}) => {
  const session = useSession();
  if (session.status == "unauthenticated") return;

  const [loading, setLoading] = useState(false);

  const submitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    (e.target as HTMLFormElement).reset();

    setLoading(true);
    const res = await fetch(`/api/comment/${postId}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("An error ocurred commenting", {
        position: "bottom-right",
        duration: 2000,
      });
      setLoading(false);
      return;
    }

    const { comment } = await res.json();
    if (comment) setComments((comments) => [comment, ...comments]);

    toast.success("Commented succesfully", {
      position: "bottom-right",
      duration: 2000,
    });

    setLoading(false);
  };

  return (
    <form
      onSubmit={submitComment}
      className="my-1 flex flex-col items-start justify-center sm:mx-4"
    >
      {session.data?.user.name ? (
        <h1>
          comment as{" "}
          <span className="text-orange-500">u/{session.data.user.name}</span>
        </h1>
      ) : (
        ""
      )}
      <textarea
        maxLength={10000}
        name="content"
        className="mb-1 h-32 max-h-44 w-full border border-text bg-background-100 p-1 text-sm"
        placeholder="What are your thoughts?"
        required
      />
      <input
        type="submit"
        className="rounded bg-primary px-1 text-background-300 hover:bg-primary/80"
        value={loading ? "" : "Comment"}
      />
    </form>
  );
};

export default postPage;

const FullPost = ({ post }: { post: Post }) => {
  const router = useRouter();
  const deletePost = async (postId: number) => {
    await fetch(`/api/post/${postId}`, { method: "DELETE" })
      .then(() => router.push("/"))
      .catch(() => {
        toast.error("An error ocurred removing post", {
          position: "bottom-right",
          duration: 2000,
        });
      });
  };

  return (
    <div
      key={post.id}
      className="flex max-w-full rounded-sm hover:border-background-300"
    >
      <section className="flex flex-col items-center justify-start rounded-l-sm px-1 py-2 text-center">
        <Vote
          downvotes={post.downvotes}
          upvotes={post.upvotes}
          isUpvote={post.isUpvote}
          postId={post.id}
        />
      </section>

      <div className="relative w-full max-w-full rounded-r-sm px-2 pb-1 hover:text-opacity-100">
        <section className="flex w-full max-w-full items-center gap-1 pt-1 text-[0.5rem] text-gray-500 sm:gap-2 sm:text-xs">
          <PostNavbar post={post} />
        </section>
        <section className="w-full max-w-full overflow-hidden">
          {post.imageId ? (
            <div className="relative mb-2 flex flex-col items-center justify-center">
              <h1 className="mt-1 w-full overflow-clip break-keep text-3xl">
                {post.title}
              </h1>
              <Image
                src={`https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${post.imageId}`}
                loading="lazy"
                width={1500}
                height={1500}
                alt="post picture"
                priority={false}
                className="h-auto max-h-96 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full break-all">
              <h1 className="my-2 w-full break-keep text-2xl">{post.title}</h1>
              {post.content ? (
                <p className="mb-1 break-keep text-base">{post.content}</p>
              ) : (
                ""
              )}
            </div>
          )}
        </section>
        <section className="flex items-center gap-2 text-gray-500">
          <PostFooter post={post} deletePost={deletePost} />
        </section>
      </div>
    </div>
  );
};
