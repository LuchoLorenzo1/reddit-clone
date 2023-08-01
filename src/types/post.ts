export default interface Post {
  title: string;
  content: string;
  username: string;
  reddit?: string;
  id: number;
  upvotes: number;
  downvotes: number;
  created_at: Date;
}
