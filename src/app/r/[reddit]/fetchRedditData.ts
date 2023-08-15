import { getRedditByName } from "@/controllers/reddits";
import Reddit from "@/types/reddit";

export const fetchRedditData = async (
  redditName: string,
  userId: number,
): Promise<Reddit | null> => {
  const reddit = await getRedditByName(redditName);
  if (!reddit) return null;
  return reddit;
};
