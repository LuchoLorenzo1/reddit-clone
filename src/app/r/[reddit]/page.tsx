import { FC } from "react";
import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import Link from "next/link";
import Image from "next/image";
import Reddit from "@/types/reddit";
import Posts from "@/components/posts";
import Post from "@/types/post";

interface RedditProps {
  params: {
    reddit: string;
  };
}

interface RedditData {
  reddit: Reddit;
  posts: Post[];
  isMember: boolean;
}

const fetchRedditData = async (
  redditName: string,
  userId: number,
): Promise<RedditData | null> => {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT * FROM reddits WHERE name LIKE ?",
    [redditName],
  );
  if (rows.length != 1) return null;

  const reddit: Reddit = rows[0] as Reddit;
  const [posts]: [RowDataPacket[], FieldPacket[]] = await pool.query<
    RowDataPacket[]
  >(
    `SELECT title, content, u.name as username, upvotes, downvotes, posts.created_at
		FROM posts
		JOIN users u
			ON posts.author_id = u.id
		WHERE reddit_id = ?
		ORDER BY created_at DESC`,
    [reddit.id],
  );

  const [member]: [RowDataPacket[], FieldPacket[]] = await pool.query<
    RowDataPacket[]
  >(`SELECT * FROM members WHERE user_id = ? AND reddit_id = ?`, [
    userId,
    reddit.id,
  ]);

  const isMember = member.length > 0;

  return {
    reddit,
    posts: posts as Post[],
    isMember,
  };
};

const Reddit: FC<RedditProps> = async ({ params }) => {
  const redditData = await fetchRedditData(params.reddit, 1);

  if (!redditData) return <Reddit404 />;

  return (
    <div className="flex h-screen flex-col items-center">
      <RedditNavbar reddit={redditData.reddit} />

      <div className="mt-3 grid w-full max-w-4xl grid-cols-3 justify-center gap-5 sm:px-5">
        <div className="col-span-3 lg:col-span-2">
          <Posts posts={redditData.posts} reddit={redditData.reddit} />
        </div>
        <AboutReddit reddit={redditData.reddit} />
      </div>
    </div>
  );
};

const RedditNavbar = ({ reddit }: { reddit: Reddit }) => {
  return (
    <div className="relative flex h-20 min-h-[14rem] w-full flex-col items-center bg-white">
      <div className="relative mb-5 min-h-[10rem] min-w-full overflow-hidden bg-blue-500">
        <Image
          loading="lazy"
          layout="fill"
          quality={100}
          objectFit="cover"
          src="/banner.jpeg"
          alt="Reddit Banner"
        />
      </div>
      <div className="absolute top-[9.5rem] flex w-full max-w-4xl items-end justify-start gap-2 px-5 sm:px-5">
        <div className="rounded-full bg-white">
          <Image
            className="rounded-full border-4 border-white"
            loading="lazy"
            src="/r.svg"
            width={80}
            height={80}
            alt="profile picture"
          />
        </div>
        <div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">{reddit.name}</h1>
            <Link
              href={`/join`}
              className="rounded-3xl border-2 border-white bg-blue-500 px-5 py-[0.15rem] text-sm font-bold text-white transition-all duration-100 hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:shadow-md"
            >
              Join
            </Link>
          </div>
          <h1 className="text-xs font-bold text-text/60">r/{reddit.name}</h1>
        </div>
      </div>
    </div>
  );
};

const AboutReddit = ({ reddit }: { reddit: Reddit }) => {
  return (
    <div className="hidden h-max flex-col rounded-sm border border-slate-500 bg-white lg:col-span-1 lg:flex">
      <h1 className="w-full rounded-tl-sm rounded-tr-sm bg-blue-500 px-2 py-2 text-left text-sm font-bold text-white ">
        About community
      </h1>
      <div className="flex flex-col gap-2 p-2">
        <p className="text-xs text-text/70">{reddit.description}</p>
        <p>Redditors: {reddit.member_count}</p>
        <Link
          href={`/post`}
          className="mt-2 rounded-xl bg-blue-500 px-2 py-1 text-center text-sm font-bold text-white hover:shadow-md"
        >
          Create Post
        </Link>
      </div>
    </div>
  );
};

const Reddit404 = () => {
  return (
    <div className="flex h-2/3 flex-col items-center justify-center gap-5 text-center">
      <div>
        <h1 className="font-bold">
          Sorry, there aren&apos;t any communities on Reddit with that name.
        </h1>
        <h2 className="opacity-60">
          {" "}
          This community may have been banned or the community name is
          incorrect.{" "}
        </h2>
      </div>
      <div className="flex gap-5">
        <Link
          href="/r/create"
          className="rounded-3xl border-2 border-background bg-blue-500 px-5 py-[0.15rem] text-sm font-bold text-white transition-all duration-100 hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:shadow-md"
        >
          Create Community
        </Link>
        <Link
          href="/"
          className="rounded-3xl border-2 border-background bg-blue-500 px-5 py-[0.15rem] text-sm font-bold text-white transition-all duration-100 hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:shadow-md"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Reddit;
