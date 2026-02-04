import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { Todo } from '@todo/shared'
import { query } from './db'

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/todos', (c) => {
  const todos: Todo[] = []
  return c.json(todos)
})

app.post('/todos', async (c) => {
  const body = await c.req.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''

  if (!title) {
    return c.json({ error: 'Title is required' }, 400)
  }

  const result = await query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed',
    [title]
  )

  const todo: Todo = {
    id: String(result.rows[0].id),
    title: result.rows[0].title,
    completed: result.rows[0].completed,
  }

  return c.json(todo, 201)
})

const port = Number(process.env.PORT ?? 3001)

serve({
  fetch: app.fetch,
  port,
})

console.log(`API running on http://localhost:${port}`)
