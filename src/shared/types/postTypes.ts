export type PostStatus = "posted" | "disabled" | "expired";

export interface CommunityPost {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    expirationDate?: string;
    status: PostStatus;
    postMedia: string[];
}