'use client'

import { useState, KeyboardEvent } from 'react'
import type { Todo } from '@todo/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AddTodoFormProps {
  onTodoAdded: (todo: Todo) => void
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setSubmitting(true)
    setError(null)
    
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add todo')
      }

      const newTodo = await res.json()
      setTitle('')
      onTodoAdded(newTodo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="w-full px-5 py-4 text-lg bg-white border-0 rounded-xl shadow-sm 
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/20 transition-shadow disabled:opacity-50"
          disabled={submitting}
          autoFocus
        />
        {title.trim() && (
          <button
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 
                       bg-blue-500 text-white text-sm font-medium rounded-lg
                       hover:bg-blue-600 active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '...' : 'Add'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm px-2">{error}</p>
      )}
    </div>
  )
}
