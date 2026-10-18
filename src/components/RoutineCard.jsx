import { EXERCISES } from '../data/exercises'

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

  // Look up catalog entry by id or normalized name
  const catalogExercise = EXERCISES.find(
    (e) =>
      e.id === exercise.id ||
      e.name.toLowerCase() === exercise.name?.toLowerCase() ||
      (exercise.name && e.name.toLowerCase().includes(exercise.name.toLowerCase()))
  )

  const exerciseImage = catalogExercise?.image || exercise.image

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
    if (value === 0 || value === '0') {
      updateExerciseSet(selectedDay, exercise.id, index, field, '')
    }
  }

  const handleBlur = (index, field, value) => {
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
          {exerciseImage ? (
            <img
              className="routine-exercise-image"
              src={exerciseImage}
              alt={exercise.name}
              onError={(e) => {
                e.target.style.display = 'none'
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex'
                }
              }}
            />
          ) : null}

          {/* Clean equipment fallback if image is missing */}
          <div
            className="routine-image-placeholder"
            style={{
              display: exerciseImage ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: '#f1f5f9',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              textAlign: 'center',
              padding: '4px'
            }}
          >
            {catalogExercise?.equipment || 'Exercise'}
          </div>
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