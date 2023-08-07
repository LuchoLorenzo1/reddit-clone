export default interface Reddit {
  id: number;
  name: string;
  description: string;
  member_count: number;
  image_link?: string;
}

export type RedditInfo = {
  redditId: number;
  reddit: string;
  image: string;
};
