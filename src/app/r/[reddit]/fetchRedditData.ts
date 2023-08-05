import pool from "@/database/db";
import Post from "@/types/post";
import Reddit from "@/types/reddit";
import { FieldPacket, RowDataPacket } from "mysql2";

interface RedditData {
  reddit: Reddit;
  posts: Post[];
  isMember: boolean;
}

export const fetchRedditData = async (
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
    `SELECT posts.id, title, content, u.name as username, upvotes, downvotes, posts.created_at, v.is_upvote as isUpvote
		FROM posts
		JOIN users u
			ON posts.author_id = u.id
		LEFT JOIN votes v
			ON posts.id = v.post_id AND v.user_id = ?
		WHERE reddit_id = ?
		ORDER BY created_at DESC`,
    [userId, reddit.id],
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
