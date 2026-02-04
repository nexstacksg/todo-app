'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@todo/shared'
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/todos`)
      if (!res.ok) throw new Error('Failed to fetch todos')
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev])
  }

  const handleToggleTodo = (id: string, updatedTodo: Todo) => {
    setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 40, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>NexStack Todo App</h1>
      
      <AddTodoForm onTodoAdded={handleTodoAdded} />
      
      {loading ? (
        <p>Loading todos...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TodoList 
          todos={todos} 
          onToggle={handleToggleTodo} 
          onDelete={handleDeleteTodo} 
        />
      )}
    </main>
  )
}
