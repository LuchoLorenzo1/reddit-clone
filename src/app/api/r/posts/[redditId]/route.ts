import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPostsByReddit } from "@/controllers/posts";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { redditId: number } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  if (isNaN(params.redditId))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  try {
    const posts = await getPostsByReddit(params.redditId, session.user.id);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
