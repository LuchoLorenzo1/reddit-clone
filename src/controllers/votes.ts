import { FieldPacket, ResultSetHeader } from "mysql2";
import pool from "@/database/db";

const saveVote = async (vote: number, userId: number, postId: number) => {
  let res: [ResultSetHeader, FieldPacket[]];

  if (vote == 0) {
    res = await pool.query(
      "DELETE FROM votes WHERE user_id = ? AND post_id = ?",
      [userId, postId],
    );
  } else if (vote == 1) {
    res = await pool.query(
      "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, true) ON DUPLICATE KEY UPDATE is_upvote = true",
      [userId, postId],
    );
  } else {
    res = await pool.query(
      "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, false) ON DUPLICATE KEY UPDATE is_upvote = false",
      [userId, postId],
    );
  }

  return res[0].affectedRows > 0;
};

export default saveVote;
