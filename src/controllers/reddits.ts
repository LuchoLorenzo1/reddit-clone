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
    `SELECT reddit_id as redditId, r.name AS reddit, r.image_id AS imageId, r.banner_id as bannerId
	  FROM members
	  JOIN reddits r
	  	ON reddit_id = r.id
	  WHERE user_id = ?`,
    [userId],
  );
  return res[0] as RedditInfo[];
};

export const getRedditRecommendations = async (
  userId: number,
): Promise<RedditInfo[]> => {
  const res = await pool.query(
    `SELECT id as redditId, name AS reddit, image_id AS imageId
	FROM reddits
		WHERE id NOT IN (SELECT reddit_id FROM members WHERE user_id = ?)
	ORDER BY member_count
	LIMIT 5
	`,
    [userId],
  );
  return res[0] as RedditInfo[];
};

export const getRedditByName = async (
  redditName: string,
): Promise<Reddit | undefined> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT id, name, description, member_count, image_id as imageId, banner_id as bannerId, created_at as createdAt FROM reddits WHERE name LIKE ?",
    [redditName],
  );

  return res[0][0] as Reddit;
};

export const getRedditById = async (
  redditId: number,
): Promise<Reddit | undefined> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT id, name, description, member_count, image_id as imageId, banner_id as bannerId FROM reddits WHERE id = ?",
    [redditId],
  );

  return res[0][0] as Reddit;
};

export const createReddit = async (
  {
    name,
    description,
    bannerId,
    imageId,
  }: {
    name: string;
    description: string;
    bannerId?: string;
    imageId?: string;
  },
  userId: number,
) => {
  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "INSERT INTO reddits (name, description, image_id, banner_id) VALUES (?, ?, ?, ?)",
    [name, description, imageId, bannerId],
  );

  if (res[0].affectedRows <= 0) return false;

  const redditId = res[0].insertId;
  const res2: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "INSERT INTO members (user_id, reddit_id) VALUES (?, ?)",
    [userId, redditId],
  );

  return redditId;
};

export const updateReddit = async (
  data: {
    name?: string;
    description?: string;
    bannerId?: string;
    imageId?: string;
  },
  redditId: number,
) => {
  const update: {
    name?: string;
    description?: string;
    banner_id?: string;
    image_id?: string;
  } = {};

  if (data.name) update.name = data.name;
  if (data.description) update.description = data.description;
  if (data.bannerId) update.banner_id = data.bannerId;
  if (data.imageId) update.image_id = data.imageId;

  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "UPDATE reddits SET ? WHERE id = ?",
    [update, redditId],
  );

  return res[0].affectedRows == 1;
};

export const deleteReddit = async (redditId: number) => {
  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "DELETE FROM reddits WHERE id = ?",
    [redditId],
  );

  return res[0].affectedRows == 1;
};
