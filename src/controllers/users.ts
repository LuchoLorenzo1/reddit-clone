import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/database/db";
import User from "@/types/user";

export const getUserByProvider = async (
  provider: string,
  providerAccountId: string,
): Promise<User | undefined> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT id, name, image_id as imageId FROM users WHERE provider LIKE ? AND provider_id LIKE ?",
    [provider, providerAccountId],
  );

  return res[0][0] as User | undefined;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
    "SELECT id, name, image_id as imageId FROM users WHERE id = ?",
    [id],
  );

  return res[0][0] as User | undefined;
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

export const updateUser = async (
  { name, imageId }: { name?: string; imageId?: string },
  userId: number,
) => {
  const update: { name?: string; image_id?: string } = {};
  if (name) update.name = name;
  if (imageId) update.image_id = imageId;

  const res: [ResultSetHeader, FieldPacket[]] = await pool.query(
    "UPDATE users SET ? WHERE id = ?",
    [update, userId],
  );

  return res[0].affectedRows == 1;
};
