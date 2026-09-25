import React, { useMemo, useState } from 'react'

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function ActivityHeatmap({ history = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  // 1. Group sessions by YYYY-MM-DD
  const activityMap = useMemo(() => {
    const map = new Map()

    history.forEach((session) => {
      const dateStr = session.date || session.timestamp
      if (!dateStr) return

      const key = formatDateKey(new Date(dateStr))
      const existing = map.get(key) || {
        totalSets: 0,
        completedSets: 0,
        sessionsCount: 0,
        workouts: []
      }

      existing.totalSets += session.totalSets || 0
      existing.completedSets += session.completedSets || 0
      existing.sessionsCount += 1
      existing.workouts.push(session.dayName || 'Workout')

      map.set(key, existing)
    })

    return map
  }, [history])

  // 2. Build 12 separate month blocks
  const { monthBlocks, totalWorkoutsPastYear, maxStreak, activeDaysCount } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activeDays = 0
    let currentStreak = 0
    let calculatedMaxStreak = 0
    let workoutsPastYear = 0

    // Collect trailing 12 calendar months (from 11 months ago up to current month)
    const blocks = []
    const startYear = today.getFullYear()
    const startMonthIndex = today.getMonth() - 11

    for (let offset = 0; offset < 12; offset++) {
      const currentTarget = new Date(startYear, startMonthIndex + offset, 1)
      const year = currentTarget.getFullYear()
      const month = currentTarget.getMonth()

      // Number of days in this month
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      // What day of week does day 1 land on? (0=Mon, 6=Sun)
      const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7

      const monthWeeks = []
      let currentWeek = []

      // Pad leading empty days before Day 1
      for (let p = 0; p < firstDayOfWeek; p++) {
        currentWeek.push({ isEmpty: true })
      }

      // Populate every day of this month
      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const iterDate = new Date(year, month, dayNum)
        const dateKey = formatDateKey(iterDate)
        const isFuture = iterDate > today
        const log = !isFuture ? activityMap.get(dateKey) : null

        let tier = 0
        if (log && log.completedSets > 0) {
          const ratio = log.totalSets > 0 ? log.completedSets / log.totalSets : 1
          if (ratio >= 0.8) tier = 3
          else if (ratio >= 0.5) tier = 2
          else tier = 1

          activeDays += 1
          workoutsPastYear += log.sessionsCount
          currentStreak += 1
          if (currentStreak > calculatedMaxStreak) {
            calculatedMaxStreak = currentStreak
          }
        } else if (!isFuture) {
          currentStreak = 0
        }

        currentWeek.push({
          isEmpty: false,
          date: iterDate,
          dateKey,
          isFuture,
          log,
          tier
        })

        if (currentWeek.length === 7) {
          monthWeeks.push(currentWeek)
          currentWeek = []
        }
      }

      // Pad remaining empty slots in the final week of the month
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({ isEmpty: true })
        }
        monthWeeks.push(currentWeek)
      }

      blocks.push({
        label: MONTH_NAMES[month],
        year,
        weeks: monthWeeks
      })
    }

    return {
      monthBlocks: blocks,
      totalWorkoutsPastYear: workoutsPastYear,
      maxStreak: calculatedMaxStreak,
      activeDaysCount: activeDays
    }
  }, [activityMap])

  return (
    <div className="activity-heatmap-card">
      {/* Header Stat Summary */}
      <div className="heatmap-header">
        <div className="heatmap-headline">
          <span className="heatmap-total-count">{totalWorkoutsPastYear}</span>
          <span className="heatmap-total-subtext">workouts in the past year</span>
        </div>
        <div className="heatmap-stats">
          <div className="heatmap-stat-item">
            <span className="stat-label">Total Active Days</span>
            <span className="stat-number">{activeDaysCount}</span>
          </div>
          <div className="heatmap-stat-item">
            <span className="stat-label">Max Streak</span>
            <span className="stat-number">{maxStreak} {maxStreak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="heatmap-scroll-area">
        <div className="heatmap-grid-wrapper">
          {/* Day of week labels on the far left */}
          <div className="heatmap-day-labels">
            {DAY_LABELS.map((lbl, idx) => (
              <span key={idx} className="heatmap-day-label">
                {lbl}
              </span>
            ))}
          </div>

          {/* 12 Segregated Month Islands */}
          <div className="heatmap-months-container">
            {monthBlocks.map((monthBlock, mIdx) => (
              <div key={mIdx} className="heatmap-month-island">
                {/* 7-row columns for this month */}
                <div className="heatmap-month-weeks">
                  {monthBlock.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="heatmap-week-column">
                      {week.map((cell, cIdx) => {
                        if (cell.isEmpty) {
                          return <div key={cIdx} className="heatmap-cell cell-empty" />
                        }

                        const isHovered = hoveredDay?.dateKey === cell.dateKey
                        return (
                          <div
                            key={cell.dateKey}
                            className={`heatmap-cell tier-${cell.tier} ${cell.isFuture ? 'cell-future' : ''} ${isHovered ? 'cell-hovered' : ''}`}
                            onMouseEnter={() => !cell.isFuture && setHoveredDay(cell)}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Month label centered under each month block */}
                <span className="heatmap-month-caption">{monthBlock.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Details & Legend */}
      <div className="heatmap-footer">
        <div className="heatmap-hover-info">
          {hoveredDay ? (
            hoveredDay.log ? (
              <span>
                <strong>{hoveredDay.log.workouts.join(', ')}</strong> on {hoveredDay.dateKey}:{' '}
                {hoveredDay.log.completedSets} / {hoveredDay.log.totalSets} sets completed
              </span>
            ) : (
              <span>No workout logged on {hoveredDay.dateKey}</span>
            )
          ) : (
            <span className="heatmap-hover-placeholder">Hover or tap a day to see details</span>
          )}
        </div>

        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <div className="heatmap-cell tier-0" title="Rest day" />
          <div className="heatmap-cell tier-1" title="Partial (< 50%)" />
          <div className="heatmap-cell tier-2" title="Solid (50% - 79%)" />
          <div className="heatmap-cell tier-3" title="Goal Met (≥ 80%)" />
          <span className="legend-label">More</span>
        </div>
      </div>
    </div>
  )
}