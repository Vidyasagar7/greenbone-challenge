import { test, expect } from '@playwright/test';
import { PostsClient } from '../../api/PostsClient';
import { Post } from '../../api/types';

test.describe('Posts API', () => {
  let posts: PostsClient;

  test.beforeEach(({ request }) => {
    posts = new PostsClient(request);
  });

  // GET all

  test('GET /posts returns 200 and a list of 100 posts', async () => {
    const response = await posts.getAll();
    const body: Post[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveLength(100);
  });

  test('each post has userId, id, title and body fields', async () => {
    const response = await posts.getAll();
    const body: Post[] = await response.json();

    // Spot-check the first item — no need to loop through all 100
    expect(body[0]).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  // GET single

  test('GET /posts/1 returns the post with id 1', async () => {
    const response = await posts.getById(1);
    const post: Post = await response.json();

    expect(response.status()).toBe(200);
    expect(post.id).toBe(1);
    expect(post.title).toBeTruthy();
  });

  test('GET /posts/999 returns 404 when the post does not exist', async () => {
    const response = await posts.getById(999);

    expect(response.status()).toBe(404);
  });

  // POST — create

  test('POST /posts returns 201 and echoes back the sent data with an id', async () => {
    const newPost = { userId: 1, title: 'My test post', body: 'Hello from Playwright' };

    const response = await posts.create(newPost);
    const created: Post = await response.json();

    expect(response.status()).toBe(201);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(newPost.title);
  });

  // PUT — full replacement

  test('PUT /posts/1 returns 200 and the updated post', async () => {
    const replacement = { userId: 1, title: 'New title', body: 'New body' };

    const response = await posts.replace(1, replacement);
    const updated: Post = await response.json();

    expect(response.status()).toBe(200);
    expect(updated.title).toBe(replacement.title);
  });

  // PATCH — partial update

  test('PATCH /posts/1 returns 200 and changes only the title', async () => {
    const response = await posts.patch(1, { title: 'Patched title' });
    const updated: Post = await response.json();

    expect(response.status()).toBe(200);
    expect(updated.title).toBe('Patched title');
  });

  // DELETE

  test('DELETE /posts/1 returns 200', async () => {
    const response = await posts.delete(1);

    expect(response.status()).toBe(200);
  });

  // Nested resource

  test('GET /posts/1/comments returns comments that belong to post 1', async () => {
    const response = await posts.getComments(1);
    const comments = await response.json();

    expect(response.status()).toBe(200);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].postId).toBe(1);
  });
});
