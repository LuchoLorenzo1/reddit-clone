import pool from "@/database/db";
import PostComment from "@/types/comments";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";

export const createComment = async (
  content: string,
  postId: number,
  authorId: number,
) => {
  const submit: any = { post_id: postId, author_id: authorId, content };

  const res: [ResultSetHeader, FieldPacket[]] =
    await pool.query<ResultSetHeader>("INSERT INTO comments SET ?", submit);

  if (res[0].affectedRows < 1) return false;

  const res2: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT content, u.name as username, c.created_at, c.id, post_id as postId
	  	FROM comments c
		JOIN users u
			ON c.author_id = u.id
		WHERE c.id = ?
		`,
    [res[0].insertId],
  );

  return res2[0][0] as PostComment;
};

export const getComments = async (postId: number) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT content, u.name as username, c.created_at, c.id, post_id as postId
	  	FROM comments c
		JOIN users u
			ON c.author_id = u.id
		WHERE post_id = ?
		`,
    [postId],
  );

  return res[0] as PostComment[];
};
