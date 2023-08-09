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

export const getFeed = async (userId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id as id, title, content, u.name as username, upvotes, downvotes, posts.created_at, r.name as reddit, r.image_id as redditImageId, is_upvote as isUpvote
			  FROM posts
			  JOIN users u
				  ON posts.author_id = u.id
			  JOIN reddits r
				  ON posts.reddit_id = r.id
			  LEFT JOIN votes v
				  ON posts.id = v.post_id AND v.user_id = ?
			  WHERE posts.reddit_id IN (SELECT reddit_id FROM members WHERE user_id = ?)
			  ORDER BY created_at DESC`,
    [userId, userId],
  );

  return res[0] as Post[];
};

export const getPostsByReddit = async (redditId: number, userId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, u.name as username, upvotes, downvotes, posts.created_at, v.is_upvote as isUpvote
		FROM posts
		JOIN users u
			ON posts.author_id = u.id
		LEFT JOIN votes v
			ON posts.id = v.post_id AND v.user_id = ?
		WHERE reddit_id = ?
		ORDER BY created_at DESC`,
    [userId, redditId],
  );

  return res[0] as Post[];
};
