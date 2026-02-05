'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@todo/shared'
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'
import TodoFilter from './TodoFilter'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type FilterType = 'all' | 'active' | 'completed'

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

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

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed)
    for (const todo of completedTodos) {
      try {
        await fetch(`${API_URL}/todos/${todo.id}`, { method: 'DELETE' })
      } catch (err) {
        console.error('Failed to delete todo:', todo.id)
      }
    }
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NexStack Todo
          </h1>
          <p className="text-gray-500 mt-2">Stay organized, get things done</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4">
          <AddTodoForm onTodoAdded={handleTodoAdded} />
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <p className="text-lg font-medium">Error loading todos</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchTodos}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <TodoList
                todos={filteredTodos}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
              
              {todos.length > 0 && (
                <TodoFilter
                  filter={filter}
                  onFilterChange={setFilter}
                  activeCount={activeCount}
                  completedCount={completedCount}
                  onClearCompleted={handleClearCompleted}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-400">
          <p>Double-click to edit a todo</p>
          <p className="mt-1">Built with ❤️ by NexStack</p>
        </footer>
      </div>
    </main>
  )
}
