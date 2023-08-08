export default interface Reddit {
  id: number;
  name: string;
  description: string;
  member_count: number;
  imageId?: string;
  bannerId?: string;
}

export type RedditInfo = {
  redditId: number;
  reddit: string;
  imageId: string;
};
