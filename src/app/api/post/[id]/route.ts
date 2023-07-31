import pool from "@/database/db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: number } }) {
  if (isNaN(params.id))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  try {
    const res: [RowDataPacket[], FieldPacket[]] = await pool.query<
      RowDataPacket[]
    >(`SELECT * FROM posts WHERE id = ${params.id}`);
    const [rows] = res;

    if (rows.length == 0)
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    return NextResponse.json({ posts: rows }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
