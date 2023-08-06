import pool from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const { name, description }: { name: string; description: string } =
    await req.json();

  if (name === undefined || description === undefined)
    return NextResponse.json({}, { status: 400 });

  try {
    throw new Error("hola");
    const res = await pool.query(
      "INSERT INTO reddits (name, description) VALUES (?, ?)",
      [name, description],
    );
    console.log(res);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred" },
      { status: 500 },
    );
  }
};