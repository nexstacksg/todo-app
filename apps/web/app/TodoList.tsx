'use client'

import type { Todo } from '@todo/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, updatedTodo: Todo) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const toggleTodo = async (todo: Todo) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      if (!res.ok) throw new Error('Failed to update todo')
      
      const updated = await res.json()
      onToggle(todo.id, updated)
    } catch (err) {
      alert('Error updating todo')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete todo')
      
      onDelete(id)
    } catch (err) {
      alert('Error deleting todo')
    }
  }

  if (todos.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>No todos found. Add one above!</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <li key={todo.id} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          padding: '12px 0',
          borderBottom: '1px solid #eee'
        }}>
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => toggleTodo(todo)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ 
            flex: 1, 
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#888' : '#000',
            fontSize: 16
          }}>
            {todo.title}
          </span>
          <button 
            onClick={() => deleteTodo(todo.id)}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#ff4d4f', 
              border: '1px solid #ff4d4f', 
              padding: '4px 8px', 
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
