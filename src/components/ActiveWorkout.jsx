import React, { useState, useEffect } from 'react';

export default function ActiveWorkout({ activeWorkout, onCancelWorkout, onFinishWorkout }) {
  const [session, setSession] = useState(activeWorkout);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer starts the moment this component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds into HH:MM:SS
  const formatTimer = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  if (!session) return null;

  // Toggle set completion
  const handleToggleSet = (exerciseIndex, setIndex) => {
    setSession((prev) => {
      const updatedExercises = prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exerciseIndex) return ex;

        const updatedSets = ex.sets.map((set, sIdx) => {
          if (sIdx !== setIndex) return set;
          return { ...set, completed: !set.completed };
        });

        return { ...ex, sets: updatedSets };
      });

      return { ...prev, exercises: updatedExercises };
    });
  };

  // In-session rep or weight edits
  const handleUpdateSetField = (exerciseIndex, setIndex, field, value) => {
    setSession((prev) => {
      const updatedExercises = prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exerciseIndex) return ex;

        const updatedSets = ex.sets.map((set, sIdx) => {
          if (sIdx !== setIndex) return set;
          return { ...set, [field]: value };
        });

        return { ...ex, sets: updatedSets };
      });

      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleFinish = () => {
    if (onFinishWorkout) {
      onFinishWorkout(session);
    }
  };

  return (
    <div className="active-workout-overlay">
      <header className="active-workout-header">
        <div>
          <span className="active-badge">ACTIVE SESSION</span>
          <div className="active-title-timer-row">
            <h2>{session.dayName}</h2>
            <span className="active-live-timer">{formatTimer(elapsedSeconds)}</span>
          </div>
          <p className="active-start-time">
            Started: {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button 
          type="button" 
          className="btn-cancel-workout" 
          onClick={onCancelWorkout}
        >
          Discard
        </button>
      </header>

      <main className="active-workout-body">
        {session.exercises.map((exercise, exIndex) => (
          <div key={exercise.id || exIndex} className="active-exercise-card">
            <div className="active-exercise-header">
              <h3>{exercise.name}</h3>
              <span className="active-muscle-tag">{exercise.muscle}</span>
            </div>

            {/* Reps on left, KG on right */}
            <div className="active-set-labels">
              <span>SET</span>
              <span>REPS</span>
              <span>KG</span>
              <span>DONE</span>
            </div>

            <div className="active-set-list">
              {exercise.sets.map((set, setIndex) => (
                <div 
                  key={setIndex} 
                  className={`active-set-row ${set.completed ? 'set-completed' : ''}`}
                >
                  <span className="set-number-label">{setIndex + 1}</span>

                  <input
                    type="number"
                    min="0"
                    value={set.reps === 0 ? '' : set.reps}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        handleUpdateSetField(exIndex, setIndex, 'reps', 0);
                      } else {
                        const val = parseInt(raw, 10);
                        handleUpdateSetField(exIndex, setIndex, 'reps', isNaN(val) ? 0 : val);
                      }
                    }}
                  />

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={set.weight === 0 ? '' : set.weight}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        handleUpdateSetField(exIndex, setIndex, 'weight', 0);
                      } else {
                        const val = parseFloat(raw);
                        handleUpdateSetField(exIndex, setIndex, 'weight', isNaN(val) ? 0 : val);
                      }
                    }}
                  />

                  <button
                    type="button"
                    className={`btn-check-set ${set.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleSet(exIndex, setIndex)}
                    aria-label={`Mark set ${setIndex + 1} as completed`}
                  >
                    {set.completed ? '✓' : ''}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer className="active-workout-footer">
        <button 
          type="button" 
          className="btn-finish-workout" 
          onClick={handleFinish}
        >
          ✓ Finish Workout
        </button>
      </footer>
    </div>
  );
}