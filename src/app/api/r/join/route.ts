import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { redditId, isJoining }: { redditId: number; isJoining: boolean } =
    await req.json();
  const { user } = session;

  if (typeof redditId == "undefined" || typeof isJoining == "undefined")
    return NextResponse.json({}, { status: 400 });

  try {
    let res;
    if (isJoining) {
      res = await pool.query(
        "INSERT INTO members (user_id, reddit_id) VALUES (?, ?)",
        [user.id, redditId],
      );
    } else {
      res = await pool.query(
        "DELETE FROM members WHERE user_id = ? AND reddit_id = ?",
        [user.id, redditId],
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
