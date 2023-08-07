import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/database/db";

export const getUserByProvider = async (
  provider: string,
  providerAccountId: string,
) => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT * FROM users WHERE provider LIKE ? AND provider_id LIKE ?",
    [provider, providerAccountId],
  );

  return res[0][0];
};

export const createUser = async (
  name: string,
  email: string,
  provider: string,
  providerAccountId: string,
) => {
  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "INSERT INTO users (name, email, provider, provider_id) VALUES (?, ?, ?, ?)",
    [name, email, provider, providerAccountId],
  );

  return res[0].insertId;
};
