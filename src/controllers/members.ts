import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2";

export const isUserRedditMember = async (userId: number, redditId: number) => {
  const [member]: [RowDataPacket[], FieldPacket[]] = await pool.query(
    `SELECT * FROM members WHERE user_id = ? AND reddit_id = ?`,
    [userId, redditId],
  );

  return member.length > 0;
};
