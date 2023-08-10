export type Result<T> =
  | { ok: true; res: T; status?: number }
  | { ok: false; msg: string; status?: number };
