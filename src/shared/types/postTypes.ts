export interface CommunityPost {
    id: string;
    name: string;
    description: string;
    media: string[];
    priority: number;
    isApproved: boolean;
    createdAt: string;
}
