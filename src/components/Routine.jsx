import { useState } from 'react'
import RoutineCard from './RoutineCard'
import RoutineBalanceDonut from './RoutineBalanceDonut'

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
  updateDayName,
  onStartWorkout
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
    <section 
      className="routine-section"
      style={{
        minHeight: '520px',
        paddingBottom: '40px',
        boxSizing: 'border-box'
      }}
    >
      {/* 2-Column Layout: Left expands wider, Right takes just what it needs */}
      <div style={{
        display: 'grid',
        /* Left column gets priority expansion, right column fits the chart snugly */
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        columnGap: '28px',
        alignItems: 'start',
        width: '100%'
      }}>

        {/* LEFT COLUMN: Wider Routine Content & Exercise Cards */}
        <div style={{ minWidth: 0, width: '100%' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Routine</h2>

          {/* Day Buttons */}
          <div className="routine-days" style={{ margin: '0 0 20px 0' }}>
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

          {selectedDay === null && (
            <p style={{ marginTop: '12px', color: '#64748b' }}>
              Select a day to view your routine.
            </p>
          )}

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

          {/* Routine Exercises / Actions for the selected day */}
          {selectedDay !== null && (
            currentExercises.length === 0 ? (
              <div className="routine-empty-state">
                <p>No exercises added to {dayNames[selectedDay] || `Day ${selectedDay}`} yet.</p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-start-workout"
                  onClick={() =>
                    onStartWorkout(
                      selectedDay,
                      dayNames[selectedDay] || `Day ${selectedDay}`,
                      currentExercises
                    )
                  }
                >
                  ▶ Start Workout
                </button>

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
            )
          )}

          {selectedDay !== null && (
            <button
              className="routine-add-button"
              onClick={handleRoutineAddExercise}
            >
              + Add Exercise
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Snug, centered, and balanced spacing */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingRight: '12px', /* Balanced outer margin */
          paddingLeft: '8px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: '13px 0 6px 0', fontSize: '25px', fontWeight: 700, color: '#0f172a' }}>
              Weekly Volume Distribution
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#64748b' }}>
              Planned work across all 7 days by target muscle.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RoutineBalanceDonut workout={workout} />
          </div>
        </div>

      </div>

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