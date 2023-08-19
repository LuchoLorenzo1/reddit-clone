import { getRedditsLike } from "@/controllers/search";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) return NextResponse.json({ reddits: [] }, { status: 200 });

  try {
    const reddits = await getRedditsLike(query);
    return NextResponse.json({ reddits }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};
