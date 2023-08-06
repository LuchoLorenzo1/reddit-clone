import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { FieldPacket, ResultSetHeader } from "mysql2";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { name, description }: { name: string; description: string } =
    await req.json();

  if (name === undefined || description === undefined)
    return NextResponse.json({}, { status: 400 });

  try {
    const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO reddits (name, description) VALUES (?, ?)",
      [name, description],
    );

    const redditId = res[0].insertId;

    await pool.query("INSERT INTO members (user_id, reddit_id) VALUES (?, ?)", [
      session.user.id,
      redditId,
    ]);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred" },
      { status: 500 },
    );
  }
};
