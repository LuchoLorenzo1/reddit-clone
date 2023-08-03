import Post from "@/types/post";
import Posts from "@/components/posts";
import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "@/database/db";

const fetchPosts = async (userId: number): Promise<Post[] | null> => {
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
};

export default async function Home() {
  const posts = await fetchPosts(1);
  if (!posts) {
    return <h1>No posts</h1>;
  }

  return (
    <div className="mt-3 flex justify-center">
      <div className="w-full max-w-4xl px-0 sm:px-5">
        <Posts posts={posts} />
      </div>
    </div>
  );
}
