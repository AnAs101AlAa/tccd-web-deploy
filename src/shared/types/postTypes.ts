export interface PostMedia {
    id: string;
    mediaUrl: string;
}

export interface CommunityPost {
    id: string;
    name: string;
    description: string;
    media: PostMedia[];
    priority: number;
    isApproved: boolean;
    createdAt: string;
}
