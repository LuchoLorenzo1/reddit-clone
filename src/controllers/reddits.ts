import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/database/db";
import Reddit, { RedditInfo } from "@/types/reddit";

export const toggleJoin = async (
  isJoining: boolean,
  userId: number,
  redditId: number,
) => {
  let res: [ResultSetHeader, FieldPacket[]];
  if (isJoining) {
    res = await pool.query(
      "INSERT INTO members (user_id, reddit_id) VALUES (?, ?)",
      [userId, redditId],
    );
  } else {
    res = await pool.query(
      "DELETE FROM members WHERE user_id = ? AND reddit_id = ?",
      [userId, redditId],
    );
  }
  return res[0].affectedRows > 0;
};

export const getRedditsFromUser = async (userId: number) => {
  const res = await pool.query(
    `SELECT reddit_id as redditId, r.name AS reddit, r.image_link AS image
	  FROM members
	  JOIN reddits r
	  	ON reddit_id = r.id
	  WHERE user_id = ?`,
    [userId],
  );
  return res[0] as RedditInfo[];
};

export const createReddit = async (
  name: string,
  description: string,
  userId: number,
) => {
  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "INSERT INTO reddits (name, description) VALUES (?, ?)",
    [name, description],
  );

  if (res[0].affectedRows <= 0) return false;

  const redditId = res[0].insertId;
  const res2: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "INSERT INTO members (user_id, reddit_id) VALUES (?, ?)",
    [userId, redditId],
  );

  return res2[0].affectedRows > 0;
};

export const getRedditByName = async (
  redditName: string,
): Promise<Reddit | undefined> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT id, name, description, member_count, image_link FROM reddits WHERE name LIKE ?",
    [redditName],
  );

  return res[0][0] as Reddit;
};
