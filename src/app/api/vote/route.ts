import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("", { status: 403 });
  }

  const { user } = session;

  const { vote, postId } = await req.json();

  if (
    typeof postId == undefined ||
    typeof postId == undefined ||
    ![-1, 0, 1].includes(vote)
  )
    return NextResponse.json({ message: "Invalid vote" }, { status: 400 });

  try {
    let res;
    if (vote == 0) {
      res = await pool.query(
        "DELETE FROM votes WHERE user_id = ? AND post_id = ?",
        [user.id, postId],
      );
    } else if (vote == 1) {
      res = await pool.query(
        "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, true) ON DUPLICATE KEY UPDATE is_upvote = true",
        [user.id, postId],
      );
    } else {
      res = await pool.query(
        "INSERT INTO votes (user_id, post_id, is_upvote) VALUES (?, ?, false) ON DUPLICATE KEY UPDATE is_upvote = false",
        [user.id, postId],
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
