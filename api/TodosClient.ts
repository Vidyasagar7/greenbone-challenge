import { APIRequestContext, APIResponse } from '@playwright/test';

export class TodosClient {
  private readonly base = '/todos';

  constructor(private readonly request: APIRequestContext) {}

  getAll(): Promise<APIResponse> {
    return this.request.get(this.base);
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.base}/${id}`);
  }

  /** Filter todos server-side by userId query param */
  getByUser(userId: number): Promise<APIResponse> {
    return this.request.get(this.base, { params: { userId } });
  }

  /** Filter by completion status */
  getByCompleted(completed: boolean): Promise<APIResponse> {
    return this.request.get(this.base, { params: { completed } });
  }
}
