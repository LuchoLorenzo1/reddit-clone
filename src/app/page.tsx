import Post from "@/types/post";
import Posts from "@/components/posts";
import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "@/database/db";

const fetchPosts = async (): Promise<Post[] | null> => {
  const res: [RowDataPacket[], FieldPacket[]] = await pool.query<
    RowDataPacket[]
  >(
    `SELECT title, content, u.name as username, upvotes, downvotes, created_at, r.name as reddit
		FROM posts
		JOIN users u
			ON posts.author_id = u.id
		JOIN reddits r
			ON posts.reddit_id = r.id
		ORDER BY created_at DESC`,
  );

  const [posts] = res;
  return posts as Post[];
};

export default async function Home() {
  const posts = await fetchPosts();
  if (!posts) {
    return <h1>No posts</h1>;
  }

  return (
    <div className="mt-3 flex justify-center">
      <div className="max-w-4xl px-0 sm:px-5">
        <Posts posts={posts} />
      </div>
    </div>
  );
}
