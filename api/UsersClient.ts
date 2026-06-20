import { APIRequestContext, APIResponse } from '@playwright/test';

export class UsersClient {
  private readonly base = '/users';

  constructor(private readonly request: APIRequestContext) {}

  getAll(): Promise<APIResponse> {
    return this.request.get(this.base);
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${id}`);
  }

  /** Fetch all posts authored by a specific user via the nested-resource URL */
  getPosts(userId: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${userId}/posts`);
  }

  /** Fetch all todos assigned to a specific user via the nested-resource URL */
  getTodos(userId: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${userId}/todos`);
  }
}
