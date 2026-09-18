import { useState, useEffect } from 'react'
import MuscleFilter from './components/MuscleFilter'
import ExerciseList from './components/ExerciseList'
import Routine from './components/Routine'
import ActiveWorkout from './components/ActiveWorkout'
import WorkoutHistory from './components/WorkoutHistory'
import MuscleHeatmap from './components/MuscleHeatmap'
import './App.css'

function App() {
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [activeSection, setActiveSection] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [routineSnapshot, setRoutineSnapshot] = useState(null)

  const handleNavClick = (section) => {
  setActiveSection((prev) => (prev === section ? null : section))
  setRoutineAddMode(false)
  }

  // Load workout history from localStorage
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('muscleproject_history')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load workout history:', e)
    }
    return []
  })

  // Save workout history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('muscleproject_history', JSON.stringify(workoutHistory))
    } catch (e) {
      console.error('Failed to save workout history:', e)
    }
  }, [workoutHistory])

  // Delete session handler for WorkoutHistory component
  const handleDeleteHistorySession = (sessionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this workout record?')
    if (!confirmed) return
    setWorkoutHistory((prev) => prev.filter((item) => item.id !== sessionId))
  }

  // Default empty workout template
  const defaultWorkout = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: []
  }

  // 1. Initialize state from localStorage (or fallback to default)
  const [workout, setWorkout] = useState(() => {
    try {
      const saved = localStorage.getItem('muscleproject_workout')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load workout from localStorage:', error)
    }
    return defaultWorkout
  })

  // 2. Automatically save workout to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('muscleproject_workout', JSON.stringify(workout))
    } catch (error) {
      console.error('Failed to save workout to localStorage:', error)
    }
  }, [workout])

  // Default day labels
  const defaultDayNames = {
    1: 'Day 1',
    2: 'Day 2',
    3: 'Day 3',
    4: 'Day 4',
    5: 'Day 5',
    6: 'Day 6',
    7: 'Day 7'
  }

  // Load custom day names from localStorage
  const [dayNames, setDayNames] = useState(() => {
    try {
      const saved = localStorage.getItem('muscleproject_day_names')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load day names:', e)
    }
    return defaultDayNames
  })

  // Save day names to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('muscleproject_day_names', JSON.stringify(dayNames))
    } catch (e) {
      console.error('Failed to save day names:', e)
    }
  }, [dayNames])

  // Update a day name
  const updateDayName = (day, newName) => {
    setDayNames((prev) => ({
      ...prev,
      [day]: newName.trim() === '' ? `Day ${day}` : newName
    }))
  }

  const [selectedDay, setSelectedDay] = useState(null)
  const [exerciseToAssign, setExerciseToAssign] = useState(null)
  const [routineAddMode, setRoutineAddMode] = useState(false)

  const addExerciseToDay = (exercise, day) => {
    setWorkout((previousWorkout) => {
      const alreadyAdded = previousWorkout[day].some(
        (item) => item.id === exercise.id
      )

      if (alreadyAdded) {
        return {
          ...previousWorkout,
          [day]: previousWorkout[day].filter(
            (item) => item.id !== exercise.id
          )
        }
      }

      return {
        ...previousWorkout,
        [day]: [
          ...previousWorkout[day],
          {
            ...exercise,
            sets: [
              { reps: 0, weight: 0 },
              { reps: 0, weight: 0 },
              { reps: 0, weight: 0 }
            ]
          }
        ]
      }
    })
  }

  const updateExerciseSet = (
    day,
    exerciseId,
    setIndex,
    field,
    value
  ) => {
    setWorkout((previousWorkout) => ({
      ...previousWorkout,
      [day]: previousWorkout[day].map((exercise) => {
        if (exercise.id !== exerciseId) return exercise

        const updatedSets = exercise.sets.map((set, index) => {
          if (index !== setIndex) return set
          return {
            ...set,
            [field]: value
          }
        })

        return {
          ...exercise,
          sets: updatedSets
        }
      })
    }))
  }

  const addExerciseSet = (day, exerciseId) => {
    setWorkout((previousWorkout) => ({
      ...previousWorkout,
      [day]: previousWorkout[day].map((exercise) => {
        if (exercise.id !== exerciseId) return exercise
        if (exercise.sets.length >= 4) return exercise

        const lastSet = exercise.sets[exercise.sets.length - 1]
        const newSet = lastSet
          ? { reps: lastSet.reps, weight: lastSet.weight }
          : { reps: 10, weight: 0 }

        return {
          ...exercise,
          sets: [...exercise.sets, newSet]
        }
      })
    }))
  }

  const removeExerciseSet = (day, exerciseId, setIndex) => {
    setWorkout((previousWorkout) => ({
      ...previousWorkout,
      [day]: previousWorkout[day].map((exercise) => {
        if (exercise.id !== exerciseId) return exercise
        if (exercise.sets.length <= 1) return exercise

        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        }
      })
    }))
  }

  const clearDayRoutine = (day) => {
    setWorkout((previousWorkout) => ({
      ...previousWorkout,
      [day]: []
    }))
  }

  const copyDayRoutine = (fromDay, toDay) => {
    setWorkout((previousWorkout) => {
      const clonedExercises = JSON.parse(JSON.stringify(previousWorkout[fromDay]))

      return {
        ...previousWorkout,
        [toDay]: clonedExercises
      }
    })
  }

  const removeExercise = (exerciseId) => {
    setWorkout((previousWorkout) => {
      const updatedWorkout = {}

      Object.keys(previousWorkout).forEach((day) => {
        updatedWorkout[day] = previousWorkout[day].filter(
          (exercise) => exercise.id !== exerciseId
        )
      })

      return updatedWorkout
    })
  }

  const isExerciseAdded = (exerciseId) => {
    return Object.values(workout).some((dayExercises) =>
      dayExercises.some((exercise) => exercise.id === exerciseId)
    )
  }

  const openExerciseAssignment = (exercise) => {
    setExerciseToAssign(exercise)
  }

  const closeExerciseAssignment = () => {
    setExerciseToAssign(null)
  }

  const handleRoutineAddExercise = () => {
    setRoutineSnapshot(structuredClone(workout))
    setRoutineAddMode(true)
    setActiveSection('selector')
  }

  const handleCancelRoutineAdd = () => {
    if (routineSnapshot) {
      setWorkout(routineSnapshot)
      setRoutineSnapshot(null)
    }
    setRoutineAddMode(false)
    setActiveSection('routine')
  }

  const handleDoneRoutineAdd = () => {
    setRoutineSnapshot(null)
    setRoutineAddMode(false)
    setActiveSection('routine')
  } 

  const handleExerciseFromRoutine = (exercise) => {
    if (selectedDay !== null) {
      addExerciseToDay(exercise, selectedDay)
    }
  }

  const handleStartWorkout = (dayNumber, dayName, exercises) => {
    const preparedExercises = exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({
        ...s,
        targetReps: s.reps,
        targetWeight: s.weight,
        completed: false
      }))
    }))

    const session = {
      dayNumber,
      dayName,
      startTime: new Date().toISOString(),
      exercises: structuredClone(preparedExercises)
    }

    setActiveWorkout(session)
  }

  const handleCancelWorkout = () => {
    const confirmDiscard = window.confirm(
      'Are you sure you want to discard this workout? Progress will not be saved.'
    )
    if (confirmDiscard) {
      setActiveWorkout(null)
    }
  }

  const handleFinishWorkout = (completedSession) => {
    const endTime = new Date()
    const startTime = new Date(completedSession.startTime)
    const durationMinutes = Math.max(1, Math.round((endTime - startTime) / 60000))

    let totalSetsCount = 0
    let completedSetsCount = 0
    let targetsHitCount = 0
    const musclesSet = new Set()

    completedSession.exercises.forEach((ex) => {
      if (ex.muscle) musclesSet.add(ex.muscle.toLowerCase())

      ex.sets.forEach((set) => {
        totalSetsCount += 1
        if (set.completed) {
          completedSetsCount += 1
          if (set.reps >= set.targetReps) {
            targetsHitCount += 1
          }
        }
      })
    })

    const newHistoryEntry = {
      id: `session-${Date.now()}`,
      dayNumber: completedSession.dayNumber,
      dayName: completedSession.dayName,
      date: endTime.toISOString(),
      durationMinutes,
      totalSets: totalSetsCount,
      completedSets: completedSetsCount,
      targetsHit: targetsHitCount,
      muscles: Array.from(musclesSet),
      exercises: completedSession.exercises
    }

    setWorkoutHistory((prevHistory) => [newHistoryEntry, ...prevHistory])

    alert(
      `Workout Logged!\n` +
      `Duration: ${durationMinutes} min\n` +
      `Sets Completed: ${completedSetsCount} / ${totalSetsCount}\n` +
      `Targets Hit or Exceeded: ${targetsHitCount}`
    )

    setActiveWorkout(null)
  }

  if (activeWorkout) {
    return (
      <ActiveWorkout
        activeWorkout={activeWorkout}
        onCancelWorkout={handleCancelWorkout}
        onFinishWorkout={handleFinishWorkout}
      />
    )
  }

  return (
    <div className="app">
      <h1 className="title">MuscleProject</h1>
      <p className="subtitle">Your personal workout tracker</p>

      {/* Top Navigation */}
      <div className="section-navigation">
        <button
          className={activeSection === 'selector' ? 'active-section' : ''}
          onClick={() => handleNavClick('selector')}
        >
          Exercise Selector
        </button>

        <button
          className={activeSection === 'routine' ? 'active-section' : ''}
          onClick={() => handleNavClick('routine')}
        >
          Routine
        </button>

        <button
          className={activeSection === 'history' ? 'active-section' : ''}
          onClick={() => handleNavClick('history')}
        >
          History
        </button>
      </div>

      {/* DASHBOARD HERO: Heatmap appears here when no section is opened */}
      {activeSection === null && (
        <section className="dashboard-section">
          <MuscleHeatmap history={workoutHistory} />
        </section>
      )}

      {activeSection === 'selector' && (
        <section className="exercise-selector-section">
          <h2>Exercise Selector</h2>

          {routineAddMode && selectedDay !== null && (
            <div className="routine-add-message">
              <strong>Add Exercise to {dayNames[selectedDay] || `Day ${selectedDay}`}</strong>
              <div className="routine-add-actions">
                <button
                  type="button"
                  className="btn-routine-done"
                  onClick={handleDoneRoutineAdd}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="btn-routine-cancel"
                  onClick={handleCancelRoutineAdd}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <MuscleFilter
            selectedMuscle={selectedMuscle}
            setSelectedMuscle={setSelectedMuscle}
          />

          <ExerciseList
            selectedMuscle={selectedMuscle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            addExerciseToDay={addExerciseToDay}
            removeExercise={removeExercise}
            workout={workout}
            isExerciseAdded={isExerciseAdded}
            openExerciseAssignment={openExerciseAssignment}
            routineAddMode={routineAddMode}
            handleExerciseFromRoutine={handleExerciseFromRoutine}
            selectedDay={selectedDay}
            dayNames={dayNames}
          />

          {exerciseToAssign !== null && !routineAddMode && (
            <div className="assignment-panel">
              <div className="assignment-content">
                <h3>Add {exerciseToAssign.name}</h3>
                <p>Select the days for this exercise.</p>

                <div className="assignment-days">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const assigned = workout[day].some(
                      (exercise) => exercise.id === exerciseToAssign.id
                    )

                    return (
                      <button
                        key={day}
                        className={assigned ? 'assigned-day' : ''}
                        onClick={() =>
                          addExerciseToDay(exerciseToAssign, day)
                        }
                      >
                        {dayNames[day] || `Day ${day}`}
                        {assigned && ' ✓'}
                      </button>
                    )
                  })}
                </div>

                <button
                  className="close-assignment"
                  onClick={closeExerciseAssignment}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeSection === 'routine' && (
        <Routine
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          workout={workout}
          addExerciseToDay={addExerciseToDay}
          handleRoutineAddExercise={handleRoutineAddExercise}
          updateExerciseSet={updateExerciseSet}
          addExerciseSet={addExerciseSet}
          removeExerciseSet={removeExerciseSet}
          clearDayRoutine={clearDayRoutine}
          copyDayRoutine={copyDayRoutine}
          dayNames={dayNames}
          updateDayName={updateDayName}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {activeSection === 'history' && (
        <WorkoutHistory
          history={workoutHistory}
          onDeleteSession={handleDeleteHistorySession}
        />
      )}
    </div>
  )
}

export default App