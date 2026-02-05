'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import type { Todo } from '@todo/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, updatedTodo: Todo) => void
  onDelete: (id: string) => void
}

function TodoItem({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo
  onToggle: (id: string, updatedTodo: Todo) => void
  onDelete: (id: string) => void 
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const [isUpdating, setIsUpdating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const toggleTodo = async () => {
    if (isUpdating) return
    setIsUpdating(true)
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
      console.error('Error updating todo')
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteTodo = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete todo')
      onDelete(todo.id)
    } catch (err) {
      console.error('Error deleting todo')
      setIsUpdating(false)
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(todo.title)
  }

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (!trimmed) {
      await deleteTodo()
      return
    }
    
    if (trimmed !== todo.title) {
      setIsUpdating(true)
      try {
        const res = await fetch(`${API_URL}/todos/${todo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: trimmed }),
        })
        if (!res.ok) throw new Error('Failed to update todo')
        const updated = await res.json()
        onToggle(todo.id, updated)
      } catch (err) {
        console.error('Error updating todo')
      } finally {
        setIsUpdating(false)
      }
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(todo.title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="group flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 text-gray-800 bg-transparent border-b-2 border-blue-500 
                     focus:outline-none py-1"
        />
      </div>
    )
  }

  return (
    <div className={`group flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm
                    hover:shadow-md transition-shadow ${isUpdating ? 'opacity-50' : ''}`}>
      <button
        onClick={toggleTodo}
        disabled={isUpdating}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all ${
                      todo.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 hover:border-emerald-400'
                    }`}
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <span
        onDoubleClick={handleDoubleClick}
        className={`flex-1 text-gray-800 cursor-pointer select-none transition-all ${
          todo.completed ? 'line-through text-gray-400' : ''
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={deleteTodo}
        disabled={isUpdating}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                   text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 
                   hover:text-red-500 transition-all disabled:cursor-not-allowed"
        title="Delete"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">No todos yet</p>
        <p className="text-sm">Add one above to get started!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
