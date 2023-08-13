export default interface Post {
  title: string;
  content?: string;
  username: string;
  reddit?: string;
  id: number;
  upvotes: number;
  downvotes: number;
  imageId?: string;
  created_at: Date;
  isUpvote?: boolean;
  redditImageId: string;
}

export interface SubmitPostData {
  title: string;
  redditId: number;
  content?: string;
  imageId?: string;
}
