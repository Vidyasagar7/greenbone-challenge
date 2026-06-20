import { APIRequestContext, APIResponse } from '@playwright/test';
import { NewPost, Post } from './types';

/**
 * API client for the /posts resource.
 * Mirrors the Page Object pattern used in the UI layer — each method wraps a
 * single HTTP call so tests read like domain actions, not raw fetch calls.
 */
export class PostsClient {
  private readonly base = '/posts';

  constructor(private readonly request: APIRequestContext) {}

  getAll(): Promise<APIResponse> {
    return this.request.get(this.base);
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${id}`);
  }

  getComments(postId: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${postId}/comments`);
  }

  create(post: NewPost): Promise<APIResponse> {
    return this.request.post(this.base, { data: post });
  }

  /** Full replacement — all fields must be supplied */
  replace(id: number, post: NewPost): Promise<APIResponse> {
    return this.request.put(`${this.base}/${id}`, { data: post });
  }

  /** Partial update — only the supplied fields are changed */
  patch(id: number, fields: Partial<Post>): Promise<APIResponse> {
    return this.request.patch(`${this.base}/${id}`, { data: fields });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.base}/${id}`);
  }
}
