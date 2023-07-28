import pool from "@/database/db";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface Post {
	title: string;
	content: string;
	id?: number;
}

export async function POST(req: Request) {
	const { title, content } = (await req.json()) as Post;

	if (!title || !content)
		return NextResponse.json({ message: "Invalid post" }, { status: 400 });

	let res: [ResultSetHeader, FieldPacket[]];
	try {
		res = await pool.query<ResultSetHeader>("INSERT INTO posts SET ?", {
			title,
			content,
			reddit_id: 1,
			author_id: 1,
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ error: "A server error ocurred" },
			{ status: 500 },
		);
	}

	const [rows] = res;
	console.log(rows)

	const post: Post = { title, content, id: rows.insertId };

	return NextResponse.json(post, { status: 200 });
}

export async function GET() {
	let res: [RowDataPacket[], FieldPacket[]];
	try {
		res = await pool.query<RowDataPacket[]>("SELECT title, content, r.name as reddit, u.name as username FROM posts JOIN reddits r ON posts.reddit_id = r.id JOIN users u ON posts.author_id = u.id");
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ error: "A server error ocurred" },
			{ status: 500 },
		);
	}

	const [rows] = res;
	return NextResponse.json({ posts: rows }, { status: 200 });
}
