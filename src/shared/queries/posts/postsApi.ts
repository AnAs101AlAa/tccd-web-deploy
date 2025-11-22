import { systemApi } from "../AxoisInstance";
import type { CommunityPost } from "@/shared/types/postTypes";

const POSTS_ROUTE = "/v1/posts/";

export class PostsApi {
  async getAllPosts(): Promise<CommunityPost[]> {
    const response = await systemApi.get(`${POSTS_ROUTE}`);
    return response.data;
  }

  async getPostById(id: string): Promise<CommunityPost> {
    const response = await systemApi.get(`${POSTS_ROUTE}${id}`);
    return response.data;
  }

  async getPostsByStatus(status: string): Promise<CommunityPost[]> {
    const response = await systemApi.get(`${POSTS_ROUTE}status/${status}`);
    return response.data;
  }
}

export const postsApi = new PostsApi();