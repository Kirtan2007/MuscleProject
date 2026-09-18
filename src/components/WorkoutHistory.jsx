import React, { useState } from 'react';

export default function WorkoutHistory({ history = [], onDeleteSession }) {
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  const toggleExpand = (sessionId) => {
    setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId));
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown Date';
    return new Date(isoString).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (session) => {
    if (typeof session.durationMinutes === 'number') {
      return `${session.durationMinutes}m`;
    }
    if (typeof session.duration === 'number') {
      const mins = Math.floor(session.duration / 60);
      const secs = session.duration % 60;
      return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return '0m';
  };

  if (!history || history.length === 0) {
    return (
      <div className="history-empty">
        <p>No logged workout sessions found in <code>muscleproject_history</code>.</p>
        <span className="history-empty-subtext">Complete an active session to see records here.</span>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Workout History</h2>
        <span className="history-count">{history.length} Total Sessions</span>
      </div>

      <div className="history-grid">
        {history.map((session) => {
          const isExpanded = expandedSessionId === session.id;
          const totalExercises = session.exercises?.length || 0;
          const totalSets = session.totalSets ?? (session.exercises?.reduce(
            (acc, ex) => acc + (ex.sets?.length || 0),
            0
          ) || 0);

          return (
            <div
              key={session.id}
              className={`history-card ${isExpanded ? 'history-card-expanded' : ''}`}
            >
              <div className="history-card-header">
                <div
                  className="history-card-title-group"
                  onClick={() => toggleExpand(session.id)}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="history-routine-title">
                    {session.dayName || session.routineName || 'Custom Workout'}
                  </h3>
                  <span className="history-timestamp">
                    {formatDate(session.date || session.completedAt)}
                  </span>
                </div>
                <div className="history-card-actions">
                  <button
                    type="button"
                    className="history-expand-btn"
                    onClick={() => toggleExpand(session.id)}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? '▲ Hide' : '▼ Details'}
                  </button>
                  <button
                    type="button"
                    className="history-delete-btn"
                    title="Delete session"
                    onClick={() => onDeleteSession(session.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="history-metrics-row">
                <div className="metric-box">
                  <span className="metric-label">Duration</span>
                  <span className="metric-val">{formatDuration(session)}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Exercises</span>
                  <span className="metric-val">{totalExercises}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Sets</span>
                  <span className="metric-val">
                    {session.completedSets != null
                      ? `${session.completedSets}/${totalSets}`
                      : totalSets}
                  </span>
                </div>
                {session.targetsHit != null && (
                  <div className="metric-box">
                    <span className="metric-label">Targets Hit</span>
                    <span className="metric-val target-accent">{session.targetsHit}</span>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="history-details-drawer">
                  {session.exercises?.map((exercise, exIdx) => (
                    <div key={exercise.id || exIdx} className="history-exercise-row">
                      <div className="history-exercise-heading">
                        <span className="history-exercise-name">{exercise.name}</span>
                        {exercise.muscle && (
                          <span className="history-muscle-tag">{exercise.muscle}</span>
                        )}
                      </div>

                      <div className="history-sets-table">
                        <div className="sets-table-header">
                          <span>Set</span>
                          <span>Weight</span>
                          <span>Reps</span>
                          <span>Target</span>
                          <span>Status</span>
                        </div>
                        {exercise.sets?.map((set, sIdx) => {
                          const targetHit = set.completed && set.reps >= (set.targetReps || 0);

                          return (
                            <div key={sIdx} className="sets-table-row">
                              <span className="set-cell-num">#{sIdx + 1}</span>
                              <span>{set.weight} kg</span>
                              <span>{set.reps}</span>
                              <span className="set-cell-target">
                                {set.targetReps != null ? `${set.targetReps} reps` : '—'}
                              </span>
                              <span>
                                {targetHit ? (
                                  <span className="badge-target-hit">Hit ✓</span>
                                ) : set.completed ? (
                                  <span className="badge-target-miss">Done</span>
                                ) : (
                                  <span className="badge-target-skipped">Skipped</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}