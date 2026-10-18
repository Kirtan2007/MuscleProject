import { useState } from 'react'
import { ROUTINE_SPLITS } from '../data/splitsData'

// Comprehensive alternative exercises mapping for customization
const ALTERNATIVE_EXERCISES = {
  'barbell-squat': ['barbell-squat', 'machine-hack-squat', 'smith-machine-squats', 'machine-leg-press'],
  'machine-leg-extension': ['machine-leg-extension', 'lunges'],
  'seated-leg-curl': ['seated-leg-curl', 'lever-bent-over-leg-curl'],
  'standing-machine-calf-raises': ['standing-machine-calf-raises', 'seated-machine-calf-raises'],
  'decline-bench-crunches': ['decline-bench-crunches', 'hanging-leg-raises', 'machine-crunches'],
  'hanging-leg-raises': ['hanging-leg-raises', 'decline-bench-crunches', 'cable-cruches'],
  'incline-smith-machine-press': ['incline-smith-machine-press', 'incline-barbell-bench-press', 'incline-dumbbell-bench-press'],
  'machine-shoulder-press': ['machine-shoulder-press', 'dumbbell-overhead-press', 'barbell-press'],
  'pec-deck-machine-fly': ['pec-deck-machine-fly', 'high-to-low-cable-fly', 'low-to-high-cable-fly'],
  'barbell-skull-crusher': ['barbell-skull-crusher', 'overhead-tricep-extension', 'rope-tricep-extension'],
  'cable-lateral-raises': ['cable-lateral-raises', 'dumbbell-lateral-raises', 'machine-lateral-raises'],
  'one-arm-tricep-extension': ['one-arm-tricep-extension', 'cable-tricep-kickback', 'dumbbell-tricep-kickback'],
  'pull-ups': ['pull-ups', 'lats-pull-down', 'close-grip-pull-down'],
  'seated-cable-rows': ['seated-cable-rows', 'machine-rows', 'chest-supported-t-bar-rows'],
  'cable-rope-lat-push-downs': ['cable-rope-lat-push-downs', 'straight-arm-bar-pull-down'],
  'dumbbell-hammer-curls': ['dumbbell-hammer-curls', 'rope-hammer-curls'],
  'incline-bench-dumbbell-curls': ['incline-bench-dumbbell-curls', 'single-arm-preacher-curls', 'dumbbell-curls'],
  'barbell-bench-press': ['barbell-bench-press', 'dumbbell-bench-press', 'smith-machine-bench-press'],
  'high-to-low-cable-fly': ['high-to-low-cable-fly', 'pec-deck-machine-fly'],
  'incline-machine-press': ['incline-machine-press', 'incline-dumbbell-bench-press'],
  'barbell-bent-over-rows': ['barbell-bent-over-rows', 'dumbbell-bent-over-rows', 'seated-cable-rows'],
  'machine-press': ['machine-press', 'dumbbell-bench-press', 'barbell-bench-press'],
  'dumbbell-lateral-raises': ['dumbbell-lateral-raises', 'cable-lateral-raises'],
  'machine-reverse-delt-fly': ['machine-reverse-delt-fly', 'rope-face-pulls'],
  'rope-tricep-extension': ['rope-tricep-extension', 'cable-press-down'],
  'barbell-curls': ['barbell-curls', 'ez-bar-curls', 'dumbbell-curls'],
  'bayesian-curls': ['bayesian-curls', 'cable-curls', 'single-arm-preacher-curls']
}

export default function SplitsSection({ workout, setWorkout, setDayNames, setActiveSection }) {
  const [selectedSplit, setSelectedSplit] = useState(ROUTINE_SPLITS[0])
  
  // Track user customizations per split: { [splitId]: { [dayNum]: [exerciseId1, exerciseId2, ...] } }
  const [customizedSplitExercises, setCustomizedSplitExercises] = useState({})

  // Get current exercises for a day (with user overrides or default split)
  const getDayExercises = (split, dayNum) => {
    if (customizedSplitExercises[split.id]?.[dayNum]) {
      return customizedSplitExercises[split.id][dayNum]
    }
    return split.days[dayNum].exercises
  }

  const handleExerciseChange = (splitId, dayNum, exerciseIndex, newExerciseId) => {
    setCustomizedSplitExercises((prev) => {
      // Get current custom state or initialize from selectedSplit.days
      const splitObj = ROUTINE_SPLITS.find(s => s.id === splitId)
      const existingDays = prev[splitId] || Object.fromEntries(
        Object.entries(splitObj.days).map(([d, data]) => [d, [...data.exercises]])
      )

      const updatedDays = structuredClone(existingDays)
      updatedDays[dayNum][exerciseIndex] = newExerciseId

      return {
        ...prev,
        [splitId]: updatedDays
      }
    })
  }

  const handleApplySplit = (split) => {
    const confirmed = window.confirm(
      `Apply "${split.name}" to your Routine? This will populate your 7-day routine with your customized exercise choices.`
    )
    if (!confirmed) return

    const newWorkout = {}
    const newDayNames = {}

    Object.entries(split.days).forEach(([dayNum, dayData]) => {
      const activeExercises = getDayExercises(split, Number(dayNum))
      newDayNames[dayNum] = dayData.name
      
      newWorkout[dayNum] = activeExercises.map((exId) => ({
        id: exId,
        name: exId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        muscle: 'Gym',
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 }
        ]
      }))
    })

    setWorkout(newWorkout)
    setDayNames(newDayNames)
    alert(`Successfully loaded "${split.name}" into your Routine!`)
    setActiveSection('routine')
  }

  return (
    <div className="splits-section" style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>Routine Split Templates</h2>
      <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '15px' }}>
        Select a professional split on the left, customize your exercises with personal alternatives, and load it instantly.
      </p>

      {/* Main Asymmetric Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px minmax(0, 1fr)',
        gap: '28px',
        alignItems: 'start'
      }}>

        {/* LEFT COLUMN: Stacked Split Template Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ROUTINE_SPLITS.map((split) => {
            const isSelected = selectedSplit.id === split.id
            return (
              <div
                key={split.id}
                onClick={() => setSelectedSplit(split)}
                style={{
                  background: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  border: isSelected ? '2px solid #0f172a' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 10px 15px -3px rgba(15, 23, 42, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{split.name}</h3>
                  <span style={{ fontSize: '12px', opacity: isSelected ? 0.8 : 0.6, fontWeight: 600 }}>
                    {Object.keys(split.days).filter(d => split.days[d].exercises.length > 0).length} Days
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  lineHeight: '1.4',
                  color: isSelected ? '#cbd5e1' : '#64748b',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {split.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* RIGHT COLUMN: Preview & Personal Customization Workspace */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.08)',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {/* Top Header & Load Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '20px',
            marginBottom: '24px',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                {selectedSplit.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', maxWidth: '600px' }}>
                {selectedSplit.description}
              </p>
            </div>
            <button
              onClick={() => handleApplySplit(selectedSplit)}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                whiteSpace: 'nowrap',
                transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              LOAD SPLIT TO ROUTINE
            </button>
          </div>

          {/* Exercise Customization System Below Preview */}
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            Customize Routine Exercises & Alternatives
          </h4>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '-12px', marginBottom: '20px' }}>
            Default recommended exercises from the professional template are marked with <span style={{ color: '#d97706', fontWeight: 700 }}>★ Recommended</span>. Use the dropdowns to swap with alternative movements.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(selectedSplit.days).map(([dayNum, dayData]) => {
              const activeExercises = getDayExercises(selectedSplit, Number(dayNum))
              const defaultExercises = dayData.exercises

              if (activeExercises.length === 0) return null

              return (
                <div
                  key={dayNum}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h5 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                      Day {dayNum}: {dayData.name}
                    </h5>
                    <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, color: '#475569' }}>
                      {activeExercises.length} Exercises
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                    {activeExercises.map((exId, idx) => {
                      const defaultExId = defaultExercises[idx]
                      const alternatives = ALTERNATIVE_EXERCISES[defaultExId] || [defaultExId]

                      return (
                        <div
                          key={idx}
                          style={{
                            background: '#ffffff',
                            border: exId === defaultExId ? '1.5px solid #cbd5e1' : '1.5px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: exId === defaultExId ? '#64748b' : '#2563eb' }}>
                              {exId === defaultExId ? '★ Recommended' : '⚡ Custom Alternative'}
                            </span>
                          </div>
                          <select
                            value={exId}
                            onChange={(e) => handleExerciseChange(selectedSplit.id, Number(dayNum), idx, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              cursor: 'pointer'
                            }}
                          >
                            {alternatives.map((alt) => (
                              <option key={alt} value={alt}>
                                {alt.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                {alt === defaultExId ? ' (Recommended)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}