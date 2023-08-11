import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getRedditById, toggleJoin } from "@/controllers/reddits";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { redditId, isJoining }: { redditId: number; isJoining: boolean } =
    await req.json();
  const { user } = session;

  if (typeof redditId != "number" || typeof isJoining != "boolean")
    return NextResponse.json({}, { status: 400 });

  try {
    await toggleJoin(isJoining, user.id, redditId);
    const redditInfo = await getRedditById(redditId);

    return NextResponse.json(redditInfo, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
