import { FC } from "react";
import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import Link from "next/link";

interface redditProps {
  params: {
    reddit: string;
  };
}

interface redditData {
  id: number;
  name: string;
  description: string;
  member_count: number;
  image_link?: string;
}

const fetchRedditData = async (reddit: string): Promise<redditData | null> => {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT * FROM reddits WHERE name LIKE "${reddit}"`,
  );
  if (rows.length != 1) return null;
  return rows[0] as redditData;
};

const reddit: FC<redditProps> = async ({ params }) => {
  const redditData = await fetchRedditData(params.reddit);

  if (!redditData) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div>
          <h1>Sorry, there aren’t any communities on Reddit with that name.</h1>
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
          GO HOME
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5 text-center">
      <h1>{redditData?.name.toUpperCase()}</h1>
      <p>{redditData?.description}</p>
      <p>{redditData?.member_count}</p>
      <Link
        href="/"
        className="rounded-xl bg-gray-300 px-3 py-2 hover:shadow-md"
      >
        GO HOME
      </Link>
    </div>
  );
};

export default reddit;
