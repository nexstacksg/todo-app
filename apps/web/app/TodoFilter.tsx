'use client'

type FilterType = 'all' | 'active' | 'completed'

interface TodoFilterProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
}

export default function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 
                    bg-white/50 backdrop-blur-sm rounded-xl">
      <span className="text-sm text-gray-500">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              filter === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear completed
        </button>
      )}
    </div>
  )
}
