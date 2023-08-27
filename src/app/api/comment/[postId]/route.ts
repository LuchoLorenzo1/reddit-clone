import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createComment, getComments } from "@/controllers/comments";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: number } },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const data = await req.formData();

  const content = data.get("content")?.toString();

  if (!content || !params.postId || isNaN(+params.postId))
    return NextResponse.json(
      { message: "Invalid comment submit" },
      { status: 400 },
    );

  try {
    const res = await createComment(content, +params.postId, session.user.id);
    if (!res)
      return NextResponse.json(
        { message: "Couldn't submit comment" },
        { status: 400 },
      );
    return NextResponse.json({ comment: res }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred, try again later" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: number } },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  if (!params.postId || isNaN(+params.postId))
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  // const { searchParams } = new URL(req.url);
  //
  // const redditIdParam = searchParams.get("r");
  // const redditId = redditIdParam && +redditIdParam ? +redditIdParam : undefined;
  //
  // const offsetParam = searchParams.get("offset");
  // const offset = offsetParam ? +offsetParam : 0;
  //
  // const limitParam = searchParams.get("limit");
  // const limit = limitParam ? +limitParam : 5;

  try {
    const comments = await getComments(params.postId);
    return NextResponse.json({ comments }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
