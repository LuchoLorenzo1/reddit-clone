import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/database/db";
import Post, { SubmitPostData } from "@/types/post";

export const getPostById = async (postId: number, userId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, r.name as reddit, u.name as username, upvotes, downvotes, posts.created_at, posts.image_id as imageId, num_comments as comments, v.is_upvote as isUpvote
	  	FROM posts
		JOIN reddits r
			ON posts.reddit_id = r.id
		JOIN users u
			ON posts.author_id = u.id
		LEFT JOIN votes v
			ON posts.id = v.post_id AND v.user_id = ?
		WHERE posts.id = ?`,
    [userId, postId],
  );

  return res[0][0] as Post | undefined;
};

export const createPost = async (
  { title, content, redditId, imageId }: SubmitPostData,
  author_id: number,
) => {
  const submit: any = { title, reddit_id: redditId, author_id };

  if (content) {
    submit.content = content;
  } else if (redditId) {
    submit.image_id = imageId;
  } else {
    return false;
  }

  const res: [ResultSetHeader, FieldPacket[]] =
    await pool.query<ResultSetHeader>("INSERT INTO posts SET ?", submit);

  return res[0].affectedRows > 0;
};

export const getPosts = async () => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, r.name as reddit, u.name as username, upvotes, downvotes, posts.created_at, posts.image_id as imageId, num_comments as comments
	  	FROM posts
		JOIN reddits r
			ON posts.reddit_id = r.id
		JOIN users u
			ON posts.author_id = u.id`,
  );
  return res[0] as Post[];
};

export const getFeed = async (
  userId: number,
  limit: number,
  offset: number,
  redditId?: number,
) => {
  let res: [RowDataPacket[], FieldPacket[]];
  if (redditId) {
    res = await pool.query(
      `SELECT posts.id, title, content, u.name as username, upvotes, downvotes, posts.created_at, v.is_upvote as isUpvote, posts.image_id as imageId, num_comments as comments
		FROM posts
		JOIN users u
			ON posts.author_id = u.id
		LEFT JOIN votes v
			ON posts.id = v.post_id AND v.user_id = ?
		WHERE reddit_id = ?
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?
		`,
      [userId, redditId, limit, offset],
    );
  } else {
    res = await pool.query(
      `SELECT posts.id as id, title, content, u.name as username, upvotes, downvotes, posts.created_at, r.name as reddit, r.image_id as redditImageId, is_upvote as isUpvote, posts.image_id as imageId, posts.num_comments as comments
				   FROM posts
				   JOIN users u
					   ON posts.author_id = u.id
				   JOIN reddits r
					   ON posts.reddit_id = r.id
				   LEFT JOIN votes v
					   ON posts.id = v.post_id AND v.user_id = ?
				   WHERE posts.reddit_id IN (SELECT reddit_id FROM members WHERE user_id = ?)
				   ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, userId, limit, offset],
    );
  }

  return res[0] as Post[];
};

export const getPostsByReddit = async (redditId: number, userId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT posts.id, title, content, u.name as username, upvotes, downvotes, posts.created_at, v.is_upvote as isUpvote, posts.image_id as imageId, num_comments as comments
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

export const deletePostById = async (postId: number) => {
  let res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "DELETE FROM posts WHERE id = ?",
    [postId],
  );

  return res[0].affectedRows == 1;
};
