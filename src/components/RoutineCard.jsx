function RoutineCard({
  exercise,
  selectedDay,
  addExerciseToDay,
  updateExerciseSet,
  addExerciseSet,
  removeExerciseSet
}) {
  if (!exercise) return null

  // Fallback defaults start reps and weight at 0
  const sets = exercise.sets || [
    { reps: 0, weight: 0 },
    { reps: 0, weight: 0 },
    { reps: 0, weight: 0 }
  ]

  const canAddSet = sets.length < 4
  const canRemoveSet = sets.length > 1

  const handleInputChange = (index, field, rawValue) => {
    if (rawValue !== '' && Number(rawValue) < 0) return

    updateExerciseSet(
      selectedDay,
      exercise.id,
      index,
      field,
      rawValue === '' ? '' : Number(rawValue)
    )
  }

  const handleFocus = (index, field, value) => {
    // Clears 0 on focus for both reps and weight
    if (value === 0 || value === '0') {
      updateExerciseSet(selectedDay, exercise.id, index, field, '')
    }
  }

  const handleBlur = (index, field, value) => {
    // If left blank when clicking away, safely restore 0
    if (value === '' || isNaN(value)) {
      updateExerciseSet(selectedDay, exercise.id, index, field, 0)
    }
  }

  return (
    <div className="routine-exercise">

      <div className="routine-card-header">
        <h3>{exercise.name}</h3>
        <button
          type="button"
          className="routine-remove-button"
          onClick={() => addExerciseToDay(exercise, selectedDay)}
        >
          Remove
        </button>
      </div>

      <div className="routine-card-body">
        <div className="routine-left">
          <img
            className="routine-exercise-image"
            src={exercise.image}
            alt={exercise.name}
          />
        </div>

        <div className="routine-middle">
          <div className="routine-set-header">
            <span>Set</span>
            <span>Reps</span>
            <span>Weight</span>
            <span></span>
          </div>

          {sets.map((set, index) => (
            <div className="routine-set-row" key={index}>
              <span>{index + 1}</span>

              {/* Reps Input with unit */}
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  value={set.reps !== undefined ? set.reps : 0}
                  onFocus={() => handleFocus(index, 'reps', set.reps)}
                  onBlur={() => handleBlur(index, 'reps', set.reps)}
                  onChange={(e) =>
                    handleInputChange(index, 'reps', e.target.value)
                  }
                />
                <span className="unit-label">reps</span>
              </div>

              {/* Weight Input with unit */}
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  value={set.weight !== undefined ? set.weight : 0}
                  onFocus={() => handleFocus(index, 'weight', set.weight)}
                  onBlur={() => handleBlur(index, 'weight', set.weight)}
                  onChange={(e) =>
                    handleInputChange(index, 'weight', e.target.value)
                  }
                />
                <span className="unit-label">kg</span>
              </div>

              {canRemoveSet ? (
                <button
                  type="button"
                  className="routine-set-remove"
                  title="Remove set"
                  onClick={() =>
                    removeExerciseSet(selectedDay, exercise.id, index)
                  }
                >
                  ✕
                </button>
              ) : (
                <span className="routine-set-remove-placeholder"></span>
              )}
            </div>
          ))}

          {canAddSet && (
            <button
              type="button"
              className="routine-add-set-button"
              onClick={() => addExerciseSet(selectedDay, exercise.id)}
            >
              + Add Set
            </button>
          )}
        </div>
      </div>

    </div>
  )
}

export default RoutineCard