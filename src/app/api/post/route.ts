import pool from "@/database/db";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, content } = await req.json();

  if (!title)
    return NextResponse.json({ message: "Invalid post" }, { status: 400 });

  try {
    const res: [ResultSetHeader, FieldPacket[]] =
      await pool.query<ResultSetHeader>("INSERT INTO posts SET ?", {
        title,
        content,
        reddit_id: 1,
        author_id: 1,
      });

    if (res[0].affectedRows == 0) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
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
