import React, { useRef, useEffect } from 'react'
import exercises from '../data/exercises'

function ExerciseList({
  selectedMuscle,
  selectedSubGroup = 'All',
  searchQuery,
  setSearchQuery,
  addExerciseToDay,
  removeExercise,
  workout,
  isExerciseAdded,
  openExerciseAssignment,
  routineAddMode,
  handleExerciseFromRoutine,
  selectedDay,
  dayNames = {}
}) {
  const searchInputRef = useRef(null)

  // Keyboard shortcut: Press "/" to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter exercises by Muscle, Sub-Group, and Multi-field Search
  const filteredExercises = exercises.filter((exercise) => {
    const matchesMuscle =
      selectedMuscle === 'All' || exercise.muscle === selectedMuscle

    const matchesSubGroup =
      selectedSubGroup === 'All' ||
      exercise.subGroup === selectedSubGroup ||
      (exercise.subGroup && exercise.subGroup.includes(selectedSubGroup))

    const cleanQuery = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !cleanQuery ||
      exercise.name.toLowerCase().includes(cleanQuery) ||
      (exercise.subGroup && exercise.subGroup.toLowerCase().includes(cleanQuery)) ||
      (exercise.equipment && exercise.equipment.toLowerCase().includes(cleanQuery))

    return matchesMuscle && matchesSubGroup && matchesSearch
  })

  const currentDayLabel = selectedDay
    ? dayNames[selectedDay] || `Day ${selectedDay}`
    : ''

  return (
    <div className="exercise-list-container">
      {/* Search Bar with Clear Button & Keyboard Shortcut Hint */}
      <div className="exercise-search-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by name, equipment, or muscle (Press '/' to focus)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', paddingRight: '36px' }}
        />
        {searchQuery ? (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => {
              setSearchQuery('')
              searchInputRef.current?.focus()
            }}
          >
            ✕
          </button>
        ) : null}
      </div>

      {filteredExercises.length === 0 ? (
        <div className="no-exercises-found">
          <p>No exercises match "{searchQuery}"</p>
        </div>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((exercise) => {
            const assignedDays = Object.keys(workout).filter((day) =>
              workout[day].some(
                (selectedExercise) => selectedExercise.id === exercise.id
              )
            )

            const exerciseIsAdded = isExerciseAdded(exercise.id)

            const isAddedToCurrentDay =
              selectedDay !== null &&
              workout[selectedDay]?.some(
                (selectedExercise) => selectedExercise.id === exercise.id
              )

            return (
              <div className="exercise-card" key={exercise.id}>
                <img
                  className="exercise-image"
                  src={exercise.image}
                  alt={exercise.name}
                />

                <div className="exercise-info">
                  <h3 style={{ margin: '0 0 6px 0' }}>{exercise.name}</h3>

                  {/* Metadata Chips: Primary Muscle, Sub-Group, and Equipment */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      background: '#e2e8f0',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {exercise.muscle}
                    </span>

                    {exercise.subGroup && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        color: '#64748b',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        {exercise.subGroup}
                      </span>
                    )}

                    {exercise.equipment && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: '#f8fafc',
                        color: '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 0, 0, 0.06)'
                      }}>
                        {exercise.equipment}
                      </span>
                    )}
                  </div>

                  {routineAddMode ? (
                    <button
                      className={
                        isAddedToCurrentDay ? 'remove-button' : 'add-button'
                      }
                      onClick={() => handleExerciseFromRoutine(exercise)}
                    >
                      {isAddedToCurrentDay
                        ? `Remove from ${currentDayLabel}`
                        : `Add to ${currentDayLabel}`}
                    </button>
                  ) : (
                    <div className="exercise-actions">
                      {!exerciseIsAdded ? (
                        <button
                          className="add-button"
                          onClick={() => openExerciseAssignment(exercise)}
                        >
                          Add Exercise
                        </button>
                      ) : (
                        <>
                          <button
                            className="add-button"
                            onClick={() => openExerciseAssignment(exercise)}
                          >
                            Add More
                          </button>

                          <button
                            className="remove-button"
                            onClick={() => removeExercise(exercise.id)}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {exerciseIsAdded && !routineAddMode && (
                    <div className="assigned-days">
                      Added to:{' '}
                      {assignedDays
                        .map((day) => dayNames[day] || `Day ${day}`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExerciseList