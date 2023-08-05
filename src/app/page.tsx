import Post from "@/types/post";
import Posts from "@/components/posts";
import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "@/database/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const fetchPosts = async (userId?: number): Promise<Post[]> => {
  if (userId) {
    const res: [RowDataPacket[], FieldPacket[]] = await pool.query<
      RowDataPacket[]
    >(
      `SELECT posts.id as id, title, content, u.name as username, upvotes, downvotes, posts.created_at, r.name as reddit, is_upvote as isUpvote
			  FROM posts
			  JOIN users u
				  ON posts.author_id = u.id
			  JOIN reddits r
				  ON posts.reddit_id = r.id
			  LEFT JOIN votes v
				  ON posts.id = v.post_id AND v.user_id = ?
			  ORDER BY created_at DESC`,
      [userId],
    );
    const [posts] = res;
    return posts as Post[];
  }
  return [];
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = await fetchPosts(session?.user?.id);

  return (
    <main className="mt-3 w-full max-w-4xl px-0 sm:px-5">
      <Posts posts={posts} />
    </main>
  );
}
