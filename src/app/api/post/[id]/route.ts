import { deletePostById, getPostById } from "@/controllers/posts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(_: Request, { params }: { params: { id: number } }) {
  if (isNaN(params.id))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  try {
    const post = await getPostById(params.id);
    if (!post)
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    return NextResponse.json({ post }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: number } },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  if (isNaN(params.id))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  try {
    const post = await deletePostById(params.id);
    if (!post)
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
