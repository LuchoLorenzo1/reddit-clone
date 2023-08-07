import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getRedditsFromUser } from "@/controllers/reddits";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 404 });

  try {
    const reddits = await getRedditsFromUser(session.user.id);
    return NextResponse.json({ reddits }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
