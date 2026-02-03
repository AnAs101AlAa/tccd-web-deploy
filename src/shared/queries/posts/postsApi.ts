import { systemApi } from "../AxoisInstance";
import type { CommunityPost } from "@/shared/types/postTypes";

const POSTS_ROUTE = "/v1/Posts";

export class PostsApi {
  async getAllPosts(
    page: number = 1,
    count: number = 10,
    filters?: {
      name?: string;
      minPriority?: number;
      maxPriority?: number;
      orderBy?: string;
      descending?: boolean;
    }
  ) {
    const params: any = {
      page,
      count,
    };

    if (filters?.name) {
      params.Name = filters.name;
    }
    if (filters?.minPriority !== undefined) {
      params.MinPriority = filters.minPriority;
    }
    if (filters?.maxPriority !== undefined) {
      params.MaxPriority = filters.maxPriority;
    }
    if (filters?.orderBy) {
      params.OrderBy = filters.orderBy;
    }
    if (filters?.descending !== undefined) {
      params.Descending = filters.descending;
    }

    const response = await systemApi.get(POSTS_ROUTE, { params });

    if (response.data.success && response.data.data) {
      // console.log("API Response Data:", response.data.data); // Debug log
      const { items, pageIndex, totalPages, totalCount } = response.data.data;
      return {
        posts: items.map((item: any): CommunityPost => ({
          id: item.id,
          name: item.name,
          description: item.description,
          media: item.media || [],
          priority: item.priority,
          createdAt: item.createdAt,
        })),
        pageIndex,
        totalPages,
        totalCount,
      };
    }

    return {
      posts: [],
      pageIndex: 1,
      totalPages: 0,
      totalCount: 0,
    };
  }

  async getPostById(id: string): Promise<CommunityPost> {
    const response = await systemApi.get(`${POSTS_ROUTE}/${id}`);
    
    if (response.data.success && response.data.data) {
      const item = response.data.data;
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        media: item.media || [],
        priority: item.priority,
        createdAt: item.createdAt,
      };
    }
    
    throw new Error("Failed to fetch post");
  }

  async getPostsByStatus(status: string): Promise<CommunityPost[]> {
    const response = await systemApi.get(`${POSTS_ROUTE}/status/${status}`);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await systemApi.delete(`${POSTS_ROUTE}/${id}`);
  }
}

export const postsApi = new PostsApi();