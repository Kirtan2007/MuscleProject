import React, { useState, useMemo } from 'react'

const MUSCLE_PALETTE = {
  Chest: '#2563eb',      // Electric Royal Blue
  Back: '#059669',       // Deep Vivid Emerald
  Legs: '#d97706',       // Warm Amber / Golden Ochre
  Shoulders: '#7c3aed',  // Vivid Violet / Indigo
  Arms: '#06b6d4',       // Bright Cyan / Turquoise
  Core: '#db2777',       // Hot Magenta / Raspberry
  Other: '#64748b',      // Cool Slate
}

// Hypertrophy volume threshold (sets per week)
const MIN_HYPERTROPHY_SETS = 6

// Core tracked muscle groups to ensure missing ones are accounted for
const PRIMARY_MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']

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
  const { segments, legendItems, totalSets } = useMemo(() => {
    // Initialize primary muscles to 0 to catch missing groups
    const counts = {}
    PRIMARY_MUSCLE_GROUPS.forEach((m) => {
      counts[m] = 0
    })

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

    // Only non-zero items form the physical SVG donut slices
    const activeSegments = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([muscle, count]) => {
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

    // Legend displays all primary muscles (active sorted first, 0-set groups at bottom)
    const allLegend = Object.entries(counts)
      .map(([muscle, count]) => ({
        muscle,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: MUSCLE_PALETTE[muscle] || '#64748b',
        isUnderTrained: count < MIN_HYPERTROPHY_SETS,
        isMissing: count === 0,
        needed: Math.max(0, MIN_HYPERTROPHY_SETS - count)
      }))
      .sort((a, b) => b.count - a.count)

    return { 
      segments: activeSegments, 
      legendItems: allLegend, 
      totalSets: total 
    }
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
    ? legendItems.find((s) => s.muscle === hoveredGroup)
    : null

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '380px'
      }}
    >
      {/* Visual Row: Donut + Muscle List side by side */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        width: '100%'
      }}>
        {/* SVG Donut Ring */}
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

            {/* Slices */}
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
                <span style={{ fontSize: '11px', color: activeFocus.isUnderTrained ? '#e11d48' : '#64748b', fontWeight: activeFocus.isUnderTrained ? 600 : 400 }}>
                  {activeFocus.isUnderTrained ? 'Low volume' : `${Math.round(activeFocus.percentage)}% of routine`}
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

        {/* Vertical Muscle Legend with Under-Trained Warnings */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: '1 1 auto',
          position: 'relative'
        }}>
          {legendItems.map((item) => {
            const isHovered = hoveredGroup === item.muscle
            const showWarning = item.isUnderTrained

            return (
              <div
                key={item.muscle}
                onMouseEnter={() => setHoveredGroup(item.muscle)}
                onMouseLeave={() => setHoveredGroup(null)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: isHovered 
                    ? (showWarning ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.05)') 
                    : (showWarning ? 'rgba(239, 68, 68, 0.03)' : 'transparent'),
                  borderBottom: showWarning ? '1px dashed #ef4444' : '1px solid transparent',
                  transform: isHovered ? 'scale(1.02) translateX(2px)' : 'scale(1)',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Dot & Muscle Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.isMissing ? 'transparent' : item.color,
                    border: item.isMissing ? '2px dashed #94a3b8' : 'none',
                    boxShadow: isHovered && !item.isMissing ? `0 0 6px ${item.color}` : 'none',
                    transition: 'all 0.18s ease'
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isHovered ? 700 : 600,
                    color: showWarning ? '#b91c1c' : (isHovered ? item.color : '#334155'),
                    transition: 'color 0.18s ease'
                  }}>
                    {item.muscle}
                  </span>
                </div>

                {/* Set count badge */}
                <span style={{ 
                  fontSize: '12px', 
                  color: showWarning ? '#b91c1c' : (isHovered ? '#0f172a' : '#64748b'), 
                  fontWeight: showWarning || isHovered ? 700 : 500,
                  transition: 'color 0.18s ease'
                }}>
                  {item.count}s/week
                </span>

                {/* Hover Tooltip Alert */}
                {showWarning && isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: '100%',
                      marginBottom: '6px',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontSize: '11px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      zIndex: 30,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      pointerEvents: 'none'
                    }}
                  >
                    <span style={{ color: '#f87171', fontWeight: 700 }}>
                      {item.isMissing ? 'Missing Muscle' : 'Low Volume'}:
                    </span>{' '}
                    {item.isMissing 
                      ? `0 sets planned. Min 6s/week recommended.` 
                      : `Add ${item.needed} more set${item.needed > 1 ? 's' : ''} to hit 6s/week.`}
                    
                    {/* Tooltip downward pointer arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '18px',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid #0f172a'
                    }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}