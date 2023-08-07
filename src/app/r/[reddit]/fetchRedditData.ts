import { isUserRedditMember } from "@/controllers/members";
import { getPostsByReddit } from "@/controllers/posts";
import { getRedditByName } from "@/controllers/reddits";
import Post from "@/types/post";
import Reddit from "@/types/reddit";

interface RedditData {
  reddit: Reddit;
  posts: Post[];
  isMember: boolean;
}

export const fetchRedditData = async (
  redditName: string,
  userId: number,
): Promise<RedditData | null> => {
  const reddit = await getRedditByName(redditName);
  if (!reddit) return null;

  const posts = await getPostsByReddit(reddit.id, userId);
  const isMember = await isUserRedditMember(userId, reddit.id);

  return {
    reddit,
    posts,
    isMember,
  };
};
