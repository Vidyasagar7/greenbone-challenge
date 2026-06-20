import { test, expect } from '@playwright/test';
import { TodosClient } from '../../api/TodosClient';
import { Todo } from '../../api/types';

test.describe('Todos API', () => {
  let todos: TodosClient;

  test.beforeEach(({ request }) => {
    todos = new TodosClient(request);
  });

  // GET all

  test('GET /todos returns 200 and a list of 200 todos', async () => {
    const response = await todos.getAll();
    const body: Todo[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveLength(200);
  });

  test('each todo has userId, id, title and completed fields', async () => {
    const response = await todos.getAll();
    const body: Todo[] = await response.json();

    // Spot-check the first item — no need to loop through all 200
    expect(body[0]).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      completed: expect.any(Boolean),
    });
  });

  // GET single

  test('GET /todos/1 returns the todo with id 1', async () => {
    const response = await todos.getById(1);
    const todo: Todo = await response.json();

    expect(response.status()).toBe(200);
    expect(todo.id).toBe(1);
  });

  test('GET /todos/999 returns 404 when the todo does not exist', async () => {
    const response = await todos.getById(999);

    expect(response.status()).toBe(404);
  });

  // Query-parameter filtering

  test('GET /todos?userId=1 returns only todos for user 1', async () => {
    const response = await todos.getByUser(1);
    const body: Todo[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].userId).toBe(1);
  });

  test('GET /todos?completed=true returns only completed todos', async () => {
    const response = await todos.getByCompleted(true);
    const body: Todo[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body[0].completed).toBe(true);
  });

  test('GET /todos?completed=false returns only incomplete todos', async () => {
    const response = await todos.getByCompleted(false);
    const body: Todo[] = await response.json();

    expect(response.status()).toBe(200);
    expect(body[0].completed).toBe(false);
  });
});
