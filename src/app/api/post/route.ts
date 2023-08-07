import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPost, getPosts } from "@/controllers/posts";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { title, content, redditId } = await req.json();

  if (!title || redditId === undefined)
    return NextResponse.json({ message: "Invalid post" }, { status: 400 });

  try {
    const res = await createPost(title, content, redditId, session.user.id);
    if (!res)
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
    const posts = await getPosts();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
