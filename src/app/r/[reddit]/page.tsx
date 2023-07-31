import { FC } from "react";
import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import Link from "next/link";
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
  joined: boolean;
}

const fetchRedditData = async (
  redditName: string,
  userId: number,
): Promise<RedditData | null> => {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT * FROM reddits WHERE name LIKE "${redditName}"`,
  );
  if (rows.length != 1) return null;

  const reddit: Reddit = rows[0] as Reddit;

  const [posts]: [RowDataPacket[], FieldPacket[]] = await pool.query<
    RowDataPacket[]
  >(
    `SELECT title, content, u.name as username, upvotes, downvotes, created_at
		FROM posts
		JOIN users u
			ON posts.author_id = u.id`,
  );

  return {
    reddit,
    posts: posts as Post[],
    joined: false,
  };
};

const Reddit: FC<RedditProps> = async ({ params }) => {
  const redditData = await fetchRedditData(params.reddit, 1);

  //  async function joinReddit() {
  //    "use server";
  //    console.log(redditData);
  //
  // const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
  // 	`INSERT * FROM reddits WHERE name LIKE "${params.reddit}"`,
  // );
  //  }

  if (!redditData) return <Reddit404 />;

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-5">
      <h1 className="w-full max-w-5xl px-0 text-left text-4xl sm:px-5">
        r/{redditData.reddit.name}
      </h1>
      <div className="grid h-full w-full max-w-5xl grid-cols-3 justify-center gap-5 px-0 sm:px-5">
        <div className="col-span-3 bg-red-100 lg:col-span-2">
          <Posts posts={redditData.posts} reddit={redditData.reddit} />
        </div>
        <div className="hidden h-max flex-col gap-5 bg-blue-100 lg:flex">
          <AboutReddit reddit={redditData.reddit} />
        </div>
      </div>
    </div>
  );
};

const AboutReddit = ({ reddit }: { reddit: Reddit }) => {
  return (
    <>
      <h1 className="w-full bg-red-100 text-center">About community</h1>
      <div className="flex flex-col items-center gap-2">
        <p>{reddit.description}</p>
        <p>Redditors: {reddit.member_count}</p>
        <Link
          href="/"
          className="rounded-xl bg-gray-300 px-3 py-2 hover:shadow-md"
        >
          HOME
        </Link>
      </div>
    </>
  );
};
// <form action={joinReddit}>
// 	<button className="bg-red-500" type="submit">Join</button>
// </form>

const Reddit404 = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center">
      <div>
        <h1>Sorry, there aren't any communities on Reddit with that name.</h1>
        <h2 className="opacity-60">
          {" "}
          This community may have been banned or the community name is
          incorrect.{" "}
        </h2>
      </div>
      <Link
        href="/r/create"
        className="rounded-xl bg-gray-300 px-3 py-2 hover:shadow-md"
      >
        Create Community
      </Link>
      <Link
        href="/"
        className="rounded-xl bg-gray-300 px-3 py-2 hover:shadow-md"
      >
        HOME
      </Link>
    </div>
  );
};

export default Reddit;
