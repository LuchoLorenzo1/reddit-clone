import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { vote, postId } = await req.json();

  if (
    typeof postId == undefined ||
    typeof postId == undefined ||
    ![-1, 0, 1].includes(vote)
  )
    return NextResponse.json({ message: "Invalid vote" }, { status: 400 });

  const userId = 1;
  try {
    let res;
    if (vote == 0) {
      res = await pool.query(
        "DELETE FROM votes WHERE user_id = ? AND post_id = ?",
        [userId, postId],
      );
    } else if (vote == 1) {
      res = await pool.query(
        "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, -1) ON DUPLICATE KEY UPDATE is_upvote = true",
        [userId, postId],
      );
    } else {
      res = await pool.query(
        "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, false) ON DUPLICATE KEY UPDATE is_upvote = false",
        [userId, postId],
      );
    }
    console.log(res);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
