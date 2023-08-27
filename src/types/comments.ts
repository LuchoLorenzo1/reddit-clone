export default interface PostComment {
  content?: string;
  username: string;
  postId: number;
  id: number;
  created_at: Date | string;
}
