export type Thread = {
  _id: string;
  postedBy: {
    name: string;
    profilePic: string;
    _id: string;
  };
  text: string;
  imgs: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  repostCount: number;
  parentId: string | null;
  isHidden: boolean;
  createdAt: string;
  isFollowed?: boolean;
  likes: [string];
  isLiked: boolean;
  children: [Thread]
};
export type ThreadsListResponse = {
  success: boolean;
  threads: Thread[];
  isNext: boolean;
};