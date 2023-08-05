import pool from "@/database/db";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { title, content, redditId } = await req.json();

  if (!title || redditId === undefined)
    return NextResponse.json({ message: "Invalid post" }, { status: 400 });

  try {
    const res: [ResultSetHeader, FieldPacket[]] =
      await pool.query<ResultSetHeader>("INSERT INTO posts SET ?", {
        title,
        content,
        reddit_id: redditId,
        author_id: session.user.id,
      });

    if (res[0].affectedRows == 0)
      return NextResponse.json(
        { message: "Couldn't create post" },
        { status: 400 },
      );
    return NextResponse.json({ message: "Posted succesfuly" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred, try again later" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const res: [RowDataPacket[], FieldPacket[]] = await pool.query<
      RowDataPacket[]
    >(
      `SELECT posts.id, title, content, r.name as reddit, u.name as username, upvotes, downvotes, posts.created_at
			FROM posts
			JOIN reddits r
				ON posts.reddit_id = r.id
			JOIN users u
				ON posts.author_id = u.id`,
    );

    const [rows] = res;

    return NextResponse.json({ posts: rows }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
