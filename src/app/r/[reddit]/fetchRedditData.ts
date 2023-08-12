import { getPostsByReddit } from "@/controllers/posts";
import { getRedditByName } from "@/controllers/reddits";
import Post from "@/types/post";
import Reddit from "@/types/reddit";

interface RedditData {
  reddit: Reddit;
  posts: Post[];
}

export const fetchRedditData = async (
  redditName: string,
  userId: number,
): Promise<RedditData | null> => {
  const reddit = await getRedditByName(redditName);
  if (!reddit) return null;

  const posts = await getPostsByReddit(reddit.id, userId);

  return {
    reddit,
    posts,
  };
};
