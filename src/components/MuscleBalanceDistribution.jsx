import React, { useState, useMemo } from 'react'

const MUSCLE_TAXONOMY = {
  Chest: {
    color: '#39d353', // Emerald green
    aliases: ['chest', 'pecs', 'upper chest', 'lower chest']
  },
  Back: {
    color: '#00d2ff', // Electric cyan
    aliases: ['back', 'lats', 'traps', 'rhomboids', 'upper back', 'lower back']
  },
  Legs: {
    color: '#bf5af2', // Neon purple
    aliases: ['legs', 'quads', 'quadriceps', 'hamstrings', 'glutes', 'calves']
  },
  Shoulders: {
    color: '#ff9f0a', // Amber orange
    aliases: ['shoulders', 'delts', 'rear delts', 'front delts', 'lateral delts']
  },
  Arms: {
    color: '#ffd60a', // Bright yellow
    aliases: ['arms', 'biceps', 'triceps', 'forearms']
  },
  Core: {
    color: '#ff375f', // Hot pink / Coral
    aliases: ['core', 'abs', 'abdominals', 'obliques']
  }
}

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'All', days: null }
]

function categorizeMuscle(rawMuscle) {
  if (!rawMuscle) return 'Other'
  const val = rawMuscle.toLowerCase().trim()

  for (const [groupName, config] of Object.entries(MUSCLE_TAXONOMY)) {
    if (val === groupName.toLowerCase()) return groupName
    if (config.aliases.some((a) => val.includes(a) || a.includes(val))) {
      return groupName
    }
  }
  return 'Other'
}

export default function MuscleBalanceDistribution({ history = [] }) {
  const [timeRange, setTimeRange] = useState('1M')
  const [metric, setMetric] = useState('sets') // 'sets' | 'volume'

  // 1. Filter sessions by the selected time range
  const filteredSessions = useMemo(() => {
    const rangeConfig = TIME_RANGES.find((r) => r.label === timeRange)
    if (!rangeConfig || rangeConfig.days === null) {
      return history
    }

    const cutoff = new Date()
    cutoff.setHours(0, 0, 0, 0)
    cutoff.setDate(cutoff.getDate() - rangeConfig.days)

    return history.filter((s) => {
      const d = new Date(s.date || s.timestamp || s.completedAt)
      return !isNaN(d.getTime()) && d >= cutoff
    })
  }, [history, timeRange])

  // 2. Aggregate sets and tonnage across all 6 muscle groups
  const { distribution, totalMetricSum } = useMemo(() => {
    const counts = {
      Chest: { sets: 0, volume: 0 },
      Back: { sets: 0, volume: 0 },
      Legs: { sets: 0, volume: 0 },
      Shoulders: { sets: 0, volume: 0 },
      Arms: { sets: 0, volume: 0 },
      Core: { sets: 0, volume: 0 }
    }

    filteredSessions.forEach((session) => {
      session.exercises?.forEach((ex) => {
        const group = categorizeMuscle(ex.muscle || ex.target)
        if (!counts[group]) return

        let exCompletedSets = 0
        let exVolume = 0

        ex.sets?.forEach((s) => {
          const reps = Number(s.reps) || 0
          const weight = Number(s.weight) || 0
          const isFinished = s.completed === true || reps > 0

          if (isFinished && reps > 0) {
            exCompletedSets += 1
            exVolume += reps * (weight > 0 ? weight : 1)
          }
        })

        // Fallback for exercises with set arrays that had zeroed reps
        if (exCompletedSets === 0 && ex.sets?.length > 0) {
          exCompletedSets = ex.sets.length
          exVolume = ex.sets.length * 10
        }

        counts[group].sets += exCompletedSets
        counts[group].volume += exVolume
      })
    })

    let globalTotal = 0
    Object.values(counts).forEach((val) => {
      globalTotal += metric === 'sets' ? val.sets : val.volume
    })

    // Compute relative percentage and sort highest to lowest
    const list = Object.entries(counts).map(([name, data]) => {
      const score = metric === 'sets' ? data.sets : data.volume
      const pct = globalTotal > 0 ? Math.round((score / globalTotal) * 100) : 0
      return {
        name,
        color: MUSCLE_TAXONOMY[name].color,
        score,
        percentage: pct
      }
    })

    list.sort((a, b) => b.score - a.score)

    return {
      distribution: list,
      totalMetricSum: globalTotal
    }
  }, [filteredSessions, metric])

  return (
    <div className="muscle-balance-card">
      {/* Header & Controls */}
      <div className="balance-header">
        <div className="balance-title-group">
          <h3 className="balance-heading">Training Balance & Distribution</h3>
          <span className="balance-subheading">
            {totalMetricSum.toLocaleString()} total {metric === 'sets' ? 'sets logged' : 'kg lifted'} across major groups
          </span>
        </div>

        <div className="balance-controls">
          {/* Metric Selector */}
          <div className="graph-segmented-control">
            <button
              type="button"
              className={metric === 'sets' ? 'active' : ''}
              onClick={() => setMetric('sets')}
            >
              Sets %
            </button>
            <button
              type="button"
              className={metric === 'volume' ? 'active' : ''}
              onClick={() => setMetric('volume')}
            >
              Volume %
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="graph-segmented-control">
            {TIME_RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                className={timeRange === r.label ? 'active' : ''}
                onClick={() => setTimeRange(r.label)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {totalMetricSum === 0 ? (
        <div className="balance-empty-state">
          <p>No workout sessions logged in this timeframe to calculate muscle balance.</p>
        </div>
      ) : (
        <>
          {/* Top Multi-Segmented Stacked Bar */}
          <div className="balance-stacked-bar">
            {distribution.map((item) => {
              if (item.percentage === 0) return null
              return (
                <div
                  key={item.name}
                  className="stacked-bar-segment"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                  title={`${item.name}: ${item.percentage}% (${item.score.toLocaleString()} ${metric === 'sets' ? 'sets' : 'kg'})`}
                />
              )
            })}
          </div>

          {/* Individual Breakdown Rows */}
          <div className="balance-breakdown-list">
            {distribution.map((item) => (
              <div key={item.name} className="balance-row">
                <div className="balance-row-header">
                  <div className="balance-row-name-group">
                    <span
                      className="balance-color-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="balance-muscle-name">{item.name}</span>
                  </div>

                  <div className="balance-row-numbers">
                    <span className="balance-score-text">
                      {item.score.toLocaleString()} {metric === 'sets' ? 'sets' : 'kg'}
                    </span>
                    <span className="balance-pct-badge" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="balance-row-bar-track">
                  <div
                    className="balance-row-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}