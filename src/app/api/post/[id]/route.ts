import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: number } }) {
  let res: [RowDataPacket[], FieldPacket[]];

  if (isNaN(params.id))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  try {
    res = await pool.query<RowDataPacket[]>(
      `SELECT * FROM posts WHERE id = ${params.id}`,
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }

  const [rows] = res;

  if (rows.length == 0)
    return NextResponse.json({ error: "ID not found" }, { status: 400 });
  return NextResponse.json({ posts: rows }, { status: 200 });
}
