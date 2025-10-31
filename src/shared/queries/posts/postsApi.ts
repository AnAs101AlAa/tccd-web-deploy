import { systemApi } from "../AxoisInstance";

export interface PostData {
  id: string;
  createdOn: string;
  name: string;
  description: string;
  postMedia: string[];
  status: string;
}

const POSTS_ROUTE = "/v1/posts/";

export class PostsApi {
  async getAllPosts(): Promise<PostData[]> {
    const response = await systemApi.get(`${POSTS_ROUTE}`);
    return response.data;
  }

  async getPostById(id: string): Promise<PostData> {
    const response = await systemApi.get(`${POSTS_ROUTE}${id}`);
    return response.data;
  }

  async getPostsByStatus(status: string): Promise<PostData[]> {
    const response = await systemApi.get(`${POSTS_ROUTE}status/${status}`);
    return response.data;
  }
}

export const postsApi = new PostsApi();