import { test, expect } from '@playwright/test';
import { UsersClient } from '../../api/UsersClient';
import { User } from '../../api/types';

test.describe('Users API', () => {
  let users: UsersClient;

  test.beforeEach(({ request }) => {
    users = new UsersClient(request);
  });

  // GET all

  test('GET /users returns 200 and a list of 10 users', async () => {
    const response = await users.getAll();
    const body: User[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveLength(10);
  });

  // GET single

  test('GET /users/1 returns the user with id 1', async () => {
    const response = await users.getById(1);
    const user: User = await response.json();

    expect(response.status()).toBe(200);
    expect(user.id).toBe(1);
    expect(user.name).toBeTruthy();
    expect(user.email).toContain('@');
  });

  test('GET /users/1 includes a nested address with geo coordinates', async () => {
    const response = await users.getById(1);
    const user: User = await response.json();

    expect(user.address.city).toBeTruthy();
    expect(user.address.geo.lat).toBeTruthy();
    expect(user.address.geo.lng).toBeTruthy();
  });

  test('GET /users/999 returns 404 when the user does not exist', async () => {
    const response = await users.getById(999);

    expect(response.status()).toBe(404);
  });

  // Nested resources

  test('GET /users/1/posts returns posts that belong to user 1', async () => {
    const response = await users.getPosts(1);
    const userPosts = await response.json();

    expect(response.status()).toBe(200);
    expect(userPosts.length).toBeGreaterThan(0);
    expect(userPosts[0].userId).toBe(1);
  });

  test('GET /users/1/todos returns todos assigned to user 1', async () => {
    const response = await users.getTodos(1);
    const userTodos = await response.json();

    expect(response.status()).toBe(200);
    expect(userTodos.length).toBeGreaterThan(0);
    expect(userTodos[0].userId).toBe(1);
  });
});
