import React, { useMemo } from 'react'
import { EXERCISES } from '../data/exercises'

const SUB_GROUPS = {
  Chest: ['All', 'Chest'],
  Back: ['All', 'Lats', 'Mid Back'],
  Shoulders: ['All', 'Front Delts', 'Side Delts', 'Rear Delts'],
  Arms: ['All', 'Biceps', 'Triceps', 'Forearms'],
  Legs: ['All', 'Quads', 'Hamstrings', 'Glutes', 'Calves'],
  Core: ['All', 'Abs']
}

function normalize(str = '') {
  return str.toLowerCase().replace(/s$/, '').trim()
}

export default function MuscleFilter({
  selectedMuscle,
  setSelectedMuscle,
  selectedSubGroup = 'All',
  setSelectedSubGroup = () => {}
}) {
  const muscles = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']
  const availableSubGroups = SUB_GROUPS[selectedMuscle] || []

  // Exercise counts for primary muscle categories
  const muscleCounts = useMemo(() => {
    const counts = { All: EXERCISES.length }
    muscles.forEach((muscle) => {
      if (muscle !== 'All') {
        counts[muscle] = EXERCISES.filter((ex) => ex.muscle === muscle).length
      }
    })
    return counts
  }, [])

  // Exercise counts for sub-groups with flexible singular/plural matching
  const subGroupCounts = useMemo(() => {
    if (selectedMuscle === 'All') return {}

    const relevant = EXERCISES.filter((ex) => ex.muscle === selectedMuscle)
    const counts = { All: relevant.length }

    availableSubGroups.forEach((sub) => {
      if (sub !== 'All') {
        const cleanSub = normalize(sub)
        counts[sub] = relevant.filter((ex) => {
          if (!ex.subGroup) return false
          const cleanEx = normalize(ex.subGroup)
          return cleanEx.includes(cleanSub) || cleanSub.includes(cleanEx)
        }).length
      }
    })
    return counts
  }, [selectedMuscle, availableSubGroups])

  return (
    <div className="filter-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Primary Category Buttons with Dynamic Badges */}
      <div className="filter-buttons">
        {muscles.map((muscle) => {
          const isActive = selectedMuscle === muscle
          const count = muscleCounts[muscle] ?? 0

          return (
            <button
              key={muscle}
              type="button"
              className={isActive ? 'active-filter' : ''}
              onClick={() => {
                setSelectedMuscle(muscle)
                setSelectedSubGroup('All')
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{muscle}</span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  opacity: isActive ? 0.9 : 0.6,
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  lineHeight: '1.2'
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Target Sub-group Pills */}
      {selectedMuscle !== 'All' && availableSubGroups.length > 1 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 0',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Target:
          </span>
          {availableSubGroups.map((sub) => {
            const isActive = selectedSubGroup === sub
            const count = subGroupCounts[sub] ?? 0

            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubGroup(sub)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
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
                <span>{sub}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    opacity: isActive ? 0.85 : 0.6
                  }}
                >
                  ({count})
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}