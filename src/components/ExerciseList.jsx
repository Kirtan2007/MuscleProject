import exercises from '../data/exercises'

function ExerciseList({
  selectedMuscle,
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
  const filteredExercises = exercises.filter((exercise) => {
    const matchesMuscle =
      selectedMuscle === 'All' || exercise.muscle === selectedMuscle

    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())

    return matchesMuscle && matchesSearch
  })

  const currentDayLabel = selectedDay
    ? dayNames[selectedDay] || `Day ${selectedDay}`
    : ''

  return (
    <div className="exercise-list-container">

      <div className="exercise-search-box">
        <input
          type="text"
          placeholder="Search exercises by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
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
              workout[selectedDay].some(
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
                  <h3>{exercise.name}</h3>
                  <p>{exercise.muscle}</p>

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