import type { Todo } from '@todo/shared'

const todos: Todo[] = []

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Todo App</h1>
      <p>Monorepo scaffolding is ready.</p>
      <p>Total todos: {todos.length}</p>
    </main>
  )
}
