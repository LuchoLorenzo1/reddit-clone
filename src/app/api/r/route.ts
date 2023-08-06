import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 404 });

  try {
    const [rows] = await pool.query(
      `SELECT reddit_id, r.name AS reddit, r.image_link AS image
	  FROM members
	  JOIN reddits r
	  	ON reddit_id = r.id
	  WHERE user_id = ?`,
      [session.user.id],
    );

    return NextResponse.json({ reddits: rows }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
