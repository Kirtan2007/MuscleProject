import React, { useState, useMemo } from 'react'

const MUSCLE_PALETTE = {
  Chest: '#10b981',      // Emerald
  Back: '#06b6d4',       // Cyan
  Legs: '#3b82f6',       // Blue
  Shoulders: '#8b5cf6',  // Purple
  Arms: '#f59e0b',       // Amber
  Core: '#ec4899',       // Pink
  Other: '#64748b',      // Slate
}

function normalizeMuscle(rawMuscle) {
  if (!rawMuscle) return 'Other'
  const m = rawMuscle.toLowerCase()
  if (m.includes('chest') || m.includes('pec')) return 'Chest'
  if (m.includes('back') || m.includes('lat') || m.includes('trap')) return 'Back'
  if (m.includes('leg') || m.includes('quad') || m.includes('ham') || m.includes('calf') || m.includes('glute')) return 'Legs'
  if (m.includes('delt') || m.includes('shoulder')) return 'Shoulders'
  if (m.includes('arm') || m.includes('bicep') || m.includes('tricep') || m.includes('forearm')) return 'Arms'
  if (m.includes('core') || m.includes('abs')) return 'Core'
  return 'Other'
}

export default function RoutineBalanceDonut({ workout }) {
  const [hoveredGroup, setHoveredGroup] = useState(null)

  // Expanded ring dimensions
  const radius = 78
  const circumference = 2 * Math.PI * radius

  // Tally sets per muscle across Days 1 - 7
  const { segments, totalSets } = useMemo(() => {
    const counts = {}

    if (workout) {
      Object.values(workout).forEach((dayExercises) => {
        if (Array.isArray(dayExercises)) {
          dayExercises.forEach((ex) => {
            const group = normalizeMuscle(ex.muscle || ex.category)
            const setsCount = Array.isArray(ex.sets) ? ex.sets.length : 3
            counts[group] = (counts[group] || 0) + setsCount
          })
        }
      })
    }

    const total = Object.values(counts).reduce((acc, curr) => acc + curr, 0)
    let accumulatedOffset = 0

    const computedSegments = Object.entries(counts).map(([muscle, count]) => {
      const percentage = total > 0 ? (count / total) * 100 : 0
      const strokeLength = total > 0 ? (count / total) * circumference : 0
      const strokeDashoffset = accumulatedOffset
      accumulatedOffset -= strokeLength

      return {
        muscle,
        count,
        percentage,
        strokeLength,
        strokeDashoffset,
        color: MUSCLE_PALETTE[muscle] || '#64748b',
      }
    })

    return { segments: computedSegments, totalSets: total }
  }, [workout, circumference])

  if (totalSets === 0) {
    return (
      <div style={{
        padding: '16px',
        color: '#64748b',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        Add exercises to see volume distribution.
      </div>
    )
  }

  const activeFocus = hoveredGroup
    ? segments.find((s) => s.muscle === hoveredGroup)
    : null

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '360px'
      }}
    >

      {/* Visual Row: Larger Donut + Muscle List side by side */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        width: '100%'
      }}>
        {/* SVG Donut Ring with Increased Radius & Frame (210px) */}
        <div 
          style={{ position: 'relative', width: '190px', height: '190px', flexShrink: 0 }}
          onMouseLeave={() => setHoveredGroup(null)}
        >
          <svg
            viewBox="0 0 220 220"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <path
                id="donut-track-guide-large"
                d="M 110, 32 A 78,78 0 1,1 109.9, 32"
                fill="none"
              />
            </defs>

            {/* Base Track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="transparent"
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth="34"
              transform="rotate(-90 110 110)"
              style={{ pointerEvents: 'none' }}
            />

            {/* Slices with pointer events & hover expansions */}
            {segments.map((seg) => {
              const isHovered = hoveredGroup === seg.muscle
              return (
                <circle
                  key={seg.muscle}
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? 40 : 34}
                  strokeDasharray={`${seg.strokeLength} ${circumference}`}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 110 110)"
                  onMouseEnter={() => setHoveredGroup(seg.muscle)}
                  style={{
                    cursor: 'pointer',
                    pointerEvents: 'stroke',
                    transition: 'stroke-width 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
                    opacity: hoveredGroup && !isHovered ? 0.35 : 1,
                    filter: isHovered ? `drop-shadow(0 0 8px ${seg.color}99)` : 'none'
                  }}
                />
              )
            })}

            {/* Circular Percentage Text along the ring */}
            {segments.map((seg) => {
              if (seg.percentage < 8) return null
              const isHovered = hoveredGroup === seg.muscle
              const percentOffset = ((-seg.strokeDashoffset + (seg.strokeLength / 2) - 10) / circumference) * 100

              return (
                <text
                  key={`text-${seg.muscle}`}
                  fontSize="10"
                  fontWeight="800"
                  fill={isHovered ? '#ffffff' : 'rgba(0, 0, 0, 0.82)'}
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
                >
                  <textPath
                    href="#donut-track-guide-large"
                    startOffset={`${percentOffset}%`}
                  >
                    {Math.round(seg.percentage)}%
                  </textPath>
                </text>
              )
            })}
          </svg>

          {/* Center Hole Info */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {activeFocus ? (
              <>
                <span style={{ fontSize: '11px', color: activeFocus.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeFocus.muscle}
                </span>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {activeFocus.count}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {Math.round(activeFocus.percentage)}% of routine
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  TOTAL
                </span>
                <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {totalSets}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  planned sets
                </span>
              </>
            )}
          </div>
        </div>

        {/* Vertical Muscle List with Scaling */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          flex: '1 1 auto'
        }}>
          {segments.map((seg) => {
            const isHovered = hoveredGroup === seg.muscle
            return (
              <div
                key={seg.muscle}
                onMouseEnter={() => setHoveredGroup(seg.muscle)}
                onMouseLeave={() => setHoveredGroup(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '18px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isHovered ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
                  transform: isHovered ? 'scale(1.05) translateX(3px)' : 'scale(1)',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: isHovered ? '10px' : '8px',
                    height: isHovered ? '10px' : '8px',
                    borderRadius: '50%',
                    backgroundColor: seg.color,
                    boxShadow: isHovered ? `0 0 8px ${seg.color}` : 'none',
                    transition: 'all 0.18s ease'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isHovered ? 700 : 600,
                    color: isHovered ? seg.color : '#334155',
                    transition: 'color 0.18s ease'
                  }}>
                    {seg.muscle}
                  </span>
                </div>

                <span style={{ 
                  fontSize: '13px', 
                  color: isHovered ? '#0f172a' : '#64748b', 
                  fontWeight: isHovered ? 700 : 600,
                  transition: 'color 0.18s ease'
                }}>
                  {seg.count}s/week
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}