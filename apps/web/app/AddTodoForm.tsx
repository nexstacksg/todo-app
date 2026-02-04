'use client'

import { useState } from 'react'
import type { Todo } from '@todo/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AddTodoFormProps {
  onTodoAdded: (todo: Todo) => void
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    setSubmitting(true)
    setError(null)

    // For real optimistic update, we would add to list here with a temp ID
    // but for simplicity and to avoid complex state sync, we'll wait for the server
    // unless the user specifically wants the "add to list immediately" feeling.
    // Let's do it!
    
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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: 6, 
            border: '1px solid #ddd',
            fontSize: 16
          }}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 16
          }}
        >
          {submitting ? '...' : 'Add'}
        </button>
      </div>
      {error && <p style={{ color: '#ff4d4f', fontSize: 14, marginTop: 8, marginLeft: 4 }}>{error}</p>}
    </form>
  )
}
