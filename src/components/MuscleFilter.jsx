import React from 'react'

const SUB_GROUPS = {
  Chest: ['All', 'Upper Chest', 'Mid Chest', 'Inner/Mid Chest'],
  Back: ['All', 'Lats', 'Upper Back'],
  Shoulders: ['All', 'Front Delt', 'Side Delt', 'Rear Delt'],
  Arms: ['All', 'Biceps', 'Triceps', 'Biceps & Forearms'],
  Legs: ['All', 'Quads', 'Hamstrings & Glutes']
}

function MuscleFilter({
  selectedMuscle,
  setSelectedMuscle,
  selectedSubGroup = 'All',
  setSelectedSubGroup = () => {}
}) {
  const muscles = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs']
  const availableSubGroups = SUB_GROUPS[selectedMuscle] || []

  return (
    <div className="filter-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Primary Category Buttons */}
      <div className="filter-buttons">
        {muscles.map((muscle) => (
          <button
            key={muscle}
            className={selectedMuscle === muscle ? 'active-filter' : ''}
            onClick={() => {
              setSelectedMuscle(muscle)
              setSelectedSubGroup('All') // Reset sub-filter when switching category
            }}
          >
            {muscle}
          </button>
        ))}
      </div>

      {/* Secondary Sub-group Pills (renders only when a specific muscle is picked) */}
      {selectedMuscle !== 'All' && availableSubGroups.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 0',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Target:
          </span>
          {availableSubGroups.map((sub) => {
            const isActive = selectedSubGroup === sub
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubGroup(sub)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0f172a' : '1px solid rgba(0, 0, 0, 0.08)',
                  background: isActive ? '#0f172a' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {sub}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MuscleFilter