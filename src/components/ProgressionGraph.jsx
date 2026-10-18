import React, { useState, useMemo, useEffect, useRef } from 'react'

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'All', days: null }
]

function matchesMuscleGroup(exercise, selectedGroup) {
  if (selectedGroup === 'all') return true
  if (!exercise) return false

  const target = selectedGroup.toLowerCase().trim()
  const rawMuscle = (exercise.muscle || exercise.category || '').toLowerCase().trim()
  const rawSubGroup = (exercise.subGroup || '').toLowerCase().trim()

  // Exact primary category match
  if (rawMuscle === target) return true

  // Sub-group category containment
  if (target === 'arms' && ['biceps', 'triceps', 'forearms'].includes(rawSubGroup)) return true
  if (target === 'legs' && ['quads', 'hamstrings', 'glutes', 'calves'].includes(rawSubGroup)) return true
  if (target === 'back' && ['lats', 'mid back', 'upper back'].includes(rawSubGroup)) return true
  if (target === 'core' && ['abs'].includes(rawSubGroup)) return true

  return false
}

function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplayDate(dateKey) {
  if (!dateKey) return ''
  const parts = dateKey.split('-')
  if (parts.length !== 3) return dateKey
  const d = new Date(parts[0], parts[1] - 1, parts[2])
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ProgressionGraph({ history = [], workout = {}, targetMuscle = 'All' }) {
  const [selectedMuscle, setSelectedMuscle] = useState(targetMuscle)
  const [selectedExercise, setSelectedExercise] = useState('ALL_EXERCISES')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [timeRange, setTimeRange] = useState('7D')
  const [metric, setMetric] = useState('sets')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const dropdownRef = useRef(null)

  // Listen for updates from mannequin clicks
  useEffect(() => {
    if (targetMuscle) {
      setSelectedMuscle(targetMuscle)
      setSelectedExercise('ALL_EXERCISES')
    }
  }, [targetMuscle])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 1. Collect ONLY exercises present in the user's active routine or logged history
  const availableExercisesForMuscle = useMemo(() => {
    if (selectedMuscle === 'All') return []

    const targetGroup = selectedMuscle.toLowerCase()
    const setOfNames = new Set()

    // From active 7-day routine
    if (workout && typeof workout === 'object') {
      Object.values(workout).forEach((dayExercises) => {
        if (Array.isArray(dayExercises)) {
          dayExercises.forEach((ex) => {
            if (matchesMuscleGroup(ex, targetGroup) && ex.name) {
              setOfNames.add(ex.name)
            }
          })
        }
      })
    }

    // From user's logged workout history
    if (Array.isArray(history)) {
      history.forEach((session) => {
        session.exercises?.forEach((ex) => {
          if (matchesMuscleGroup(ex, targetGroup) && ex.name) {
            setOfNames.add(ex.name)
          }
        })
      })
    }

    return Array.from(setOfNames).sort()
  }, [workout, history, selectedMuscle])

  // 2. Filter sessions by active date window
  const filteredSessions = useMemo(() => {
    const rangeConfig = TIME_RANGES.find((r) => r.label === timeRange)
    if (!rangeConfig || rangeConfig.days === null) {
      return [...history].sort(
        (a, b) => new Date(a.date || a.timestamp || a.completedAt) - new Date(b.date || b.timestamp || b.completedAt)
      )
    }

    const cutoff = new Date()
    cutoff.setHours(0, 0, 0, 0)
    cutoff.setDate(cutoff.getDate() - rangeConfig.days)

    return history
      .filter((s) => {
        const d = new Date(s.date || s.timestamp || s.completedAt)
        return !isNaN(d.getTime()) && d >= cutoff
      })
      .sort((a, b) => new Date(a.date || a.timestamp || a.completedAt) - new Date(b.date || b.timestamp || b.completedAt))
  }, [history, timeRange])

  // 3. Aggregate points filtered by muscle & selected exercise with complete timeline continuity
  const { chartData, totalMetricSum, maxSingleDay } = useMemo(() => {
    const dateMap = new Map()
    let sum = 0
    let maxDay = 0
    const targetGroup = selectedMuscle.toLowerCase()

    filteredSessions.forEach((session) => {
      const dateStr = session.date || session.timestamp || session.completedAt
      if (!dateStr) return
      const dateObj = new Date(dateStr)
      if (isNaN(dateObj.getTime())) return
      const dateKey = formatDateKey(dateObj)

      let sessionSets = 0
      let sessionVolume = 0
      const matchedExercises = []

      session.exercises?.forEach((ex) => {
        const muscleMatches = matchesMuscleGroup(ex, targetGroup)
        const exerciseMatches =
          selectedExercise === 'ALL_EXERCISES' ||
          ex.name?.toLowerCase() === selectedExercise.toLowerCase()

        if (muscleMatches && exerciseMatches) {
          let exCompletedSets = 0
          let exTonnage = 0

          ex.sets?.forEach((s) => {
            const reps = Number(s.reps) || 0
            const weight = Number(s.weight) || 0
            const isFinished = s.completed === true || reps > 0

            if (isFinished && reps > 0) {
              exCompletedSets += 1
              exTonnage += reps * (weight > 0 ? weight : 1)
            }
          })

          if (exCompletedSets === 0 && ex.sets?.length > 0) {
            exCompletedSets = ex.sets.length
            exTonnage = ex.sets.length * 10
          }

          if (exCompletedSets > 0) {
            sessionSets += exCompletedSets
            sessionVolume += exTonnage
            matchedExercises.push({
              name: ex.name || 'Exercise',
              sets: exCompletedSets,
              volume: exTonnage
            })
          }
        }
      })

      if (sessionSets > 0 || sessionVolume > 0) {
        const existing = dateMap.get(dateKey) || {
          dateKey,
          sets: 0,
          volume: 0,
          exercises: []
        }
        existing.sets += sessionSets
        existing.volume += sessionVolume
        existing.exercises.push(...matchedExercises)
        dateMap.set(dateKey, existing)
      }
    })

    // Timeline continuity calculation
    const rangeConfig = TIME_RANGES.find((r) => r.label === timeRange)
    const points = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let totalDays = 30
    let startDate = new Date(today)

    if (rangeConfig && rangeConfig.days !== null) {
      totalDays = rangeConfig.days
      startDate.setDate(today.getDate() - totalDays + 1)
    } else {
      // "All": starts from the earliest session date recorded in history up to today
      const allDates = Array.from(dateMap.keys()).sort()
      if (allDates.length > 0) {
        const [earliestY, earliestM, earliestD] = allDates[0].split('-').map(Number)
        startDate = new Date(earliestY, earliestM - 1, earliestD)
        startDate.setHours(0, 0, 0, 0)
        const diffMs = today.getTime() - startDate.getTime()
        totalDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)
      } else {
        totalDays = 7
        startDate.setDate(today.getDate() - 6)
      }
    }

    for (let i = 0; i < totalDays; i++) {
      const curr = new Date(startDate)
      curr.setDate(startDate.getDate() + i)
      const key = formatDateKey(curr)
      const entry = dateMap.get(key) || { dateKey: key, sets: 0, volume: 0, exercises: [] }

      const val = metric === 'sets' ? entry.sets : entry.volume
      sum += val
      if (val > maxDay) maxDay = val

      points.push({
        ...entry,
        val,
        displayDate: formatDisplayDate(key)
      })
    }

    return {
      chartData: points,
      totalMetricSum: sum,
      maxSingleDay: maxDay
    }
  }, [filteredSessions, selectedMuscle, selectedExercise, timeRange, metric])

  // 4. SVG Layout & Coordinates
  const SVG_WIDTH = 800
  const SVG_HEIGHT = 260
  const PADDING = { top: 25, right: 30, bottom: 35, left: 45 }

  const innerWidth = SVG_WIDTH - PADDING.left - PADDING.right
  const innerHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom

  const yMax = Math.max(maxSingleDay * 1.25, metric === 'sets' ? 10 : 500)

  const pointsWithCoords = useMemo(() => {
    if (chartData.length === 0) return []
    const count = chartData.length

    return chartData.map((d, idx) => {
      const x =
        count === 1
          ? PADDING.left + innerWidth / 2
          : PADDING.left + (idx / (count - 1)) * innerWidth
      const y = PADDING.top + innerHeight - (d.val / yMax) * innerHeight
      return { ...d, x, y }
    })
  }, [chartData, innerWidth, innerHeight, yMax])

  const { linePath, areaPath } = useMemo(() => {
    if (pointsWithCoords.length === 0) return { linePath: '', areaPath: '' }

    let lPath = `M ${pointsWithCoords[0].x} ${pointsWithCoords[0].y}`
    pointsWithCoords.slice(1).forEach((pt) => {
      lPath += ` L ${pt.x} ${pt.y}`
    })

    const firstX = pointsWithCoords[0].x
    const lastX = pointsWithCoords[pointsWithCoords.length - 1].x
    const groundY = PADDING.top + innerHeight

    const aPath = `${lPath} L ${lastX} ${groundY} L ${firstX} ${groundY} Z`

    return { linePath: lPath, areaPath: aPath }
  }, [pointsWithCoords, innerHeight])

  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), Math.round(yMax)]

  return (
    <div className="progression-graph-card">
      {/* Control Header */}
      <div className="graph-controls-header">
        {/* Muscle Selector Pills */}
        <div className="graph-muscle-pills">
          {MUSCLE_GROUPS.map((muscle) => {
            const isMuscleActive = selectedMuscle === muscle

            return (
              <div
                key={muscle}
                className="pill-wrapper"
                ref={isMuscleActive ? dropdownRef : null}
              >
                <button
                  type="button"
                  className={`graph-pill ${isMuscleActive ? 'active' : ''}`}
                  onClick={() => {
                    if (isMuscleActive && muscle !== 'All') {
                      setDropdownOpen((prev) => !prev)
                    } else {
                      setSelectedMuscle(muscle)
                      setSelectedExercise('ALL_EXERCISES')
                      setDropdownOpen(false)
                      setHoveredPoint(null)
                    }
                  }}
                >
                  <span>
                    {isMuscleActive && selectedExercise !== 'ALL_EXERCISES'
                      ? selectedExercise
                      : muscle}
                  </span>
                  {muscle !== 'All' && isMuscleActive && (
                    <span className="dropdown-arrow-icon">▾</span>
                  )}
                </button>

                {/* Dropdown Menu attached to the active pill */}
                {isMuscleActive && dropdownOpen && (
                  <div className="exercise-dropdown-menu">
                    <div className="dropdown-title">{muscle}:</div>
                    <button
                      type="button"
                      className={`dropdown-item ${selectedExercise === 'ALL_EXERCISES' ? 'active-item' : ''}`}
                      onClick={() => {
                        setSelectedExercise('ALL_EXERCISES')
                        setDropdownOpen(false)
                      }}
                    >
                      All {muscle} Exercises
                    </button>
                    {availableExercisesForMuscle.map((exName) => (
                      <button
                        key={exName}
                        type="button"
                        className={`dropdown-item ${selectedExercise === exName ? 'active-item' : ''}`}
                        onClick={() => {
                          setSelectedExercise(exName)
                          setDropdownOpen(false)
                        }}
                      >
                        {exName}
                      </button>
                    ))}
                    {availableExercisesForMuscle.length === 0 && (
                      <div className="dropdown-empty-msg">No exercises in routine or history</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Metric and Time Range Controls */}
        <div className="graph-meta-controls">
          <div className="graph-segmented-control">
            <button
              type="button"
              className={metric === 'sets' ? 'active' : ''}
              onClick={() => setMetric('sets')}
            >
              Sets
            </button>
            <button
              type="button"
              className={metric === 'volume' ? 'active' : ''}
              onClick={() => setMetric('volume')}
            >
              Volume (kg)
            </button>
          </div>

          <div className="graph-segmented-control">
            {TIME_RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                className={timeRange === r.label ? 'active' : ''}
                onClick={() => {
                  setTimeRange(r.label)
                  setHoveredPoint(null)
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="graph-kpi-row">
        <div className="graph-kpi">
          <span className="kpi-label">Total {metric === 'sets' ? 'Sets' : 'Tonnage'}</span>
          <span className="kpi-value">
            {totalMetricSum.toLocaleString()} {metric === 'sets' ? 'sets' : 'kg'}
          </span>
        </div>
        <div className="graph-kpi">
          <span className="kpi-label">Peak Session ({timeRange})</span>
          <span className="kpi-value">
            {maxSingleDay.toLocaleString()} {metric === 'sets' ? 'sets' : 'kg'}
          </span>
        </div>
        <div className="graph-kpi">
          <span className="kpi-label">Active Focus</span>
          <span className="kpi-value text-accent">
            {selectedExercise !== 'ALL_EXERCISES' ? selectedExercise : selectedMuscle}
          </span>
        </div>
      </div>

      {/* SVG Progression Area & Line */}
      <div className="graph-svg-container">
        {pointsWithCoords.length === 0 ? (
          <div className="graph-empty-state">
            <p>
              No workout data found for{' '}
              {selectedExercise !== 'ALL_EXERCISES' ? selectedExercise : selectedMuscle} in this timeframe.
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="progression-svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="progressionAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39d353" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#39d353" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines and Y-Axis Labels */}
            {yTicks.map((tickVal, idx) => {
              const yPos = PADDING.top + innerHeight - (tickVal / yMax) * innerHeight
              return (
                <g key={idx}>
                  <line
                    x1={PADDING.left}
                    y1={yPos}
                    x2={SVG_WIDTH - PADDING.right}
                    y2={yPos}
                    stroke="#22222a"
                    strokeDasharray={idx === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={PADDING.left - 10}
                    y={yPos + 4}
                    fill="#636366"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {tickVal >= 1000 ? `${(tickVal / 1000).toFixed(1)}k` : tickVal}
                  </text>
                </g>
              )
            })}

            {/* Shaded Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#progressionAreaGradient)" />}

            {/* Line Path */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#39d353"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Coordinate Points with hover targets */}
            {pointsWithCoords.map((pt, idx) => {
              const isNonZero = pt.val > 0
              const isHovered = hoveredPoint?.dateKey === pt.dateKey

              return (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : isNonZero ? 4.5 : 2}
                  fill={isHovered ? '#ffffff' : isNonZero ? '#39d353' : '#2b2b36'}
                  stroke="#141416"
                  strokeWidth="2"
                  className="graph-point-circle"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              )
            })}

            {/* X-Axis Date Labels with automatic sampling based on range length */}
            {pointsWithCoords
              .filter((_, idx) => {
                const total = pointsWithCoords.length
                if (total <= 7) return true
                if (total <= 31) return idx % Math.ceil(total / 6) === 0
                if (total <= 95) return idx % Math.ceil(total / 6) === 0
                return idx % Math.ceil(total / 7) === 0
              })
              .map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y={SVG_HEIGHT - 10}
                  fill="#8e8e93"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {pt.displayDate}
                </text>
              ))}
          </svg>
        )}
      </div>

      {/* Tooltip Readout Card */}
      <div className="graph-tooltip-box">
        {hoveredPoint ? (
          <div className="tooltip-details">
            <span className="tooltip-date">{hoveredPoint.displayDate} ({hoveredPoint.dateKey}):</span>
            <span className="tooltip-stat">
              <strong>{hoveredPoint.val.toLocaleString()}</strong> {metric === 'sets' ? 'completed sets' : 'kg lifted'}
            </span>
            {hoveredPoint.exercises?.length > 0 && (
              <span className="tooltip-ex-list">
                • {hoveredPoint.exercises.map((e) => `${e.name} (${e.sets}s)`).join(', ')}
              </span>
            )}
          </div>
        ) : (
          <span className="tooltip-placeholder">Hover over any point on the graph to inspect the session breakdown.</span>
        )}
      </div>
    </div>
  )
}