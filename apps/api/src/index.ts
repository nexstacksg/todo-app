import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { Todo } from '@todo/shared'
import { query } from './db/index'

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/todos', async (c) => {
  const result = await query('SELECT * FROM todos ORDER BY created_at DESC')
  const todos: Todo[] = result.rows.map(row => ({
    id: String(row.id),
    title: row.title,
    completed: row.completed
  }))
  return c.json(todos)
})

app.post('/todos', async (c) => {
  const { title } = await c.req.json()
  
  if (!title || typeof title !== 'string') {
    return c.json({ error: 'Title is required' }, 400)
  }

  const result = await query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  )
  
  const todo: Todo = {
    id: String(result.rows[0].id),
    title: result.rows[0].title,
    completed: result.rows[0].completed
  }

  return c.json(todo, 201)
})

app.patch('/todos/:id', async (c) => {
  const id = c.req.param('id')
  const { completed } = await c.req.json()

  if (typeof completed !== 'boolean') {
    return c.json({ error: 'Completed status must be a boolean' }, 400)
  }

  const result = await query(
    'UPDATE todos SET completed = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [completed, id]
  )

  if (result.rows.length === 0) {
    return c.json({ error: 'Todo not found' }, 404)
  }

  const todo: Todo = {
    id: String(result.rows[0].id),
    title: result.rows[0].title,
    completed: result.rows[0].completed
  }

  return c.json(todo)
})

app.delete('/todos/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await query('DELETE FROM todos WHERE id = $1', [id])
  
  if (result.rowCount === 0) {
    return c.json({ error: 'Todo not found' }, 404)
  }

  return c.body(null, 204)
})

const port = Number(process.env.PORT ?? 3001)

serve({
  fetch: app.fetch,
  port,
})

console.log(`API running on http://localhost:${port}`)
