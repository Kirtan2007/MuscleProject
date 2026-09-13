import { useState } from 'react'
import RoutineCard from './RoutineCard'

function Routine({
  selectedDay,
  setSelectedDay,
  workout,
  addExerciseToDay,
  handleRoutineAddExercise,
  updateExerciseSet,
  addExerciseSet,
  removeExerciseSet,
  clearDayRoutine,
  copyDayRoutine,
  dayNames,
  updateDayName
}) {
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [targetCopyDay, setTargetCopyDay] = useState(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')

  const handleClear = () => {
    if (!selectedDay) return
    const currentName = dayNames[selectedDay] || `Day ${selectedDay}`
    const confirmed = window.confirm(
      `Are you sure you want to clear all exercises from ${currentName}?`
    )
    if (confirmed) {
      clearDayRoutine(selectedDay)
    }
  }

  const handleOpenCopyModal = () => {
    if (!selectedDay) return
    const firstOtherDay = [1, 2, 3, 4, 5, 6, 7].find((d) => d !== selectedDay)
    setTargetCopyDay(firstOtherDay || 1)
    setShowCopyModal(true)
  }

  const handleConfirmCopy = () => {
    if (!targetCopyDay || targetCopyDay === selectedDay) return
    const fromName = dayNames[selectedDay] || `Day ${selectedDay}`
    const toName = dayNames[targetCopyDay] || `Day ${targetCopyDay}`

    const confirmed = window.confirm(
      `Copy ${fromName} to ${toName}? This will overwrite ${toName}.`
    )
    if (confirmed) {
      copyDayRoutine(selectedDay, targetCopyDay)
      setShowCopyModal(false)
    }
  }

  const handleStartEditing = () => {
    setTempName(dayNames[selectedDay] || `Day ${selectedDay}`)
    setIsEditingName(true)
  }

  const handleSaveName = () => {
    updateDayName(selectedDay, tempName)
    setIsEditingName(false)
  }

  const currentExercises =
    selectedDay && workout && workout[selectedDay] ? workout[selectedDay] : []

  return (
    <section className="routine-section">

      <h2>Routine</h2>

      {/* Day Buttons */}
      <div className="routine-days">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <button
            key={day}
            className={selectedDay === day ? 'active-day' : ''}
            onClick={() => {
              setSelectedDay(day)
              setIsEditingName(false)
            }}
          >
            {dayNames[day] || `Day ${day}`}
          </button>
        ))}
      </div>

      {/* Rename Toolbar for Selected Day */}
      {selectedDay !== null && (
        <div className="day-title-container">
          {isEditingName ? (
            <div className="day-name-edit-box">
              <input
                type="text"
                value={tempName}
                autoFocus
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button
                type="button"
                className="save-day-name-btn"
                onClick={handleSaveName}
              >
                Save
              </button>
              <button
                type="button"
                className="cancel-day-name-btn"
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="day-name-display-box">
              <h3>{dayNames[selectedDay] || `Day ${selectedDay}`}</h3>
              <button
                type="button"
                className="edit-day-name-btn"
                onClick={handleStartEditing}
              >
                ✎ Rename
              </button>
            </div>
          )}
        </div>
      )}

      {selectedDay === null ? (
        <p>Select a day to view your routine.</p>
      ) : currentExercises.length === 0 ? (
        <div className="routine-empty-state">
          <p>No exercises added to {dayNames[selectedDay] || `Day ${selectedDay}`} yet.</p>
        </div>
      ) : (
        <>
          <div className="routine-day-actions">
            <button
              type="button"
              className="routine-clear-day-btn"
              onClick={handleClear}
            >
              Clear {dayNames[selectedDay] || `Day ${selectedDay}`}
            </button>

            <button
              type="button"
              className="routine-copy-day-btn"
              onClick={handleOpenCopyModal}
            >
              Copy Day
            </button>
          </div>

          <div className="routine-exercises">
            {currentExercises.map((exercise) => (
              <RoutineCard
                key={exercise.id}
                exercise={exercise}
                selectedDay={selectedDay}
                addExerciseToDay={addExerciseToDay}
                updateExerciseSet={updateExerciseSet}
                addExerciseSet={addExerciseSet}
                removeExerciseSet={removeExerciseSet}
              />
            ))}
          </div>
        </>
      )}

      {selectedDay !== null && (
        <button
          className="routine-add-button"
          onClick={handleRoutineAddExercise}
        >
          + Add Exercise
        </button>
      )}

      {/* Copy Modal */}
      {showCopyModal && selectedDay !== null && (
        <div className="assignment-panel">
          <div className="assignment-content">
            <h3>Copy {dayNames[selectedDay] || `Day ${selectedDay}`}</h3>
            <p>Select which day you want to copy this routine to:</p>

            <div className="copy-day-grid">
              {[1, 2, 3, 4, 5, 6, 7]
                .filter((day) => day !== selectedDay)
                .map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`copy-day-option ${
                      targetCopyDay === day ? 'selected' : ''
                    }`}
                    onClick={() => setTargetCopyDay(day)}
                  >
                    {dayNames[day] || `Day ${day}`}
                  </button>
                ))}
            </div>

            <div className="copy-modal-actions">
              <button
                type="button"
                className="copy-confirm-button"
                onClick={handleConfirmCopy}
              >
                Copy to {dayNames[targetCopyDay] || `Day ${targetCopyDay}`}
              </button>
              <button
                type="button"
                className="copy-cancel-button"
                onClick={() => setShowCopyModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default Routine