import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import saveVote from "@/controllers/votes";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { user } = session;
  const { vote, postId } = await req.json();

  if (
    typeof postId == undefined ||
    typeof vote == undefined ||
    ![-1, 0, 1].includes(vote)
  )
    return NextResponse.json({ message: "Invalid vote" }, { status: 400 });

  try {
    saveVote(vote, user.id, postId);

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
