import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { Todo } from '@todo/shared'

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/todos', (c) => {
  const todos: Todo[] = []
  return c.json(todos)
})

const port = Number(process.env.PORT ?? 3001)

serve({
  fetch: app.fetch,
  port,
})

console.log(`API running on http://localhost:${port}`)
