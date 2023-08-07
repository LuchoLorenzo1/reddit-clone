import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/database/db";
import Post from "@/types/post";

export const getPostById = async (postId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, r.name as reddit, u.name as username, upvotes, downvotes, posts.created_at
	  	FROM posts
		JOIN reddits r
			ON posts.reddit_id = r.id
		JOIN users u
			ON posts.author_id = u.id
		WHERE posts.id = ?`,
    [postId],
  );

  return res[0][0] as Post | undefined;
};

export const createPost = async (
  title: string,
  content: string,
  reddit_id: number,
  author_id: number,
) => {
  const res: [ResultSetHeader, FieldPacket[]] =
    await pool.query<ResultSetHeader>("INSERT INTO posts SET ?", {
      title,
      content,
      reddit_id,
      author_id,
    });

  return res[0].affectedRows > 0;
};

export const getPosts = async () => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, r.name as reddit, u.name as username, upvotes, downvotes, posts.created_at
	  	FROM posts
		JOIN reddits r
			ON posts.reddit_id = r.id
		JOIN users u
			ON posts.author_id = u.id`,
  );
  return res[0] as Post[];
};
