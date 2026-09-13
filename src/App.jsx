import { useState, useEffect } from 'react'
import MuscleFilter from './components/MuscleFilter'
import ExerciseList from './components/ExerciseList'
import Routine from './components/Routine'
import './App.css'
//mylfdom
function App() {
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [activeSection, setActiveSection] = useState('selector')
  const [searchQuery, setSearchQuery] = useState('')

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
        if (exercise.sets.length >= 4) return exercise // Prevent exceeding 4 sets

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
        if (exercise.sets.length <= 1) return exercise // Keep at least 1 set

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
    setRoutineAddMode(true)
    setActiveSection('selector')
  }

  const handleExerciseFromRoutine = (exercise) => {
    if (selectedDay !== null) {
      addExerciseToDay(exercise, selectedDay)
    }
  }

  return (
    <div className="app">

      <h1 className="title">MuscleProject</h1>
      <p className="subtitle">Your personal workout tracker</p>

      <div className="section-navigation">

        <button
          className={activeSection === 'selector' ? 'active-section' : ''}
          onClick={() => {
            setActiveSection('selector')
            setRoutineAddMode(false)
          }}
        >
          Exercise Selector
        </button>

        <button
          className={activeSection === 'routine' ? 'active-section' : ''}
          onClick={() => {
            setActiveSection('routine')
            setRoutineAddMode(false)
          }}
        >
          Routine
        </button>

      </div>

      {activeSection === 'selector' && (
        <section className="exercise-selector-section">

          <h2>Exercise Selector</h2>

          {routineAddMode && selectedDay !== null && (
            <div className="routine-add-message">
              <strong>
                Add Exercise to Day {selectedDay}
              </strong>

              <button
                onClick={() => setRoutineAddMode(false)}
              >
                Cancel
              </button>
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

                <h3>
                  Add {exerciseToAssign.name}
                </h3>

                <p>
                  Select the days for this exercise.
                </p>

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
                        addExerciseToDay(
                          exerciseToAssign,
                          day
                        )
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
        />
      )}

    </div>
  )
}

export default App