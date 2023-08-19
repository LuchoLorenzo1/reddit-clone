import pool from "@/database/db";
import { RedditInfo } from "@/types/reddit";

export const getRedditsLike = async (query: string) => {
  const res = await pool.query(
    "SELECT id as redditId, name AS reddit, image_id AS imageId FROM reddits WHERE name LIKE ? LIMIT 5",
    [`%${query}%`],
  );
  return res[0] as RedditInfo[];
};
