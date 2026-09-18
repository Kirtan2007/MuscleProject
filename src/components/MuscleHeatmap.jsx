import React, { useState, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ModelMannequin from './ModelMannequin'

const RECOVERY_COLORS = {
  recovering: '#ef4444',
  rebuilding: '#eab308',
  fresh: '#22c55e',
}

export default function MuscleHeatmap({ history = [] }) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null)

  const recoveryStatus = useMemo(() => {
    const now = new Date().getTime()
    const muscleLastTrained = {
      chest: null,
      shoulders: null,
      abs: null,
      biceps: null,
      triceps: null,
      forearms: null,
      back: null,
      lower_back: null,
      quads: null,
      hamstrings: null,
      calves: null,
    }

    for (const session of history) {
      const sessionDate = new Date(session.date || session.completedAt).getTime()
      if (isNaN(sessionDate)) continue

      const trainedMuscles = new Set()
      if (session.muscles && Array.isArray(session.muscles)) {
        session.muscles.forEach((m) => trainedMuscles.add(m.toLowerCase()))
      }
      if (session.exercises && Array.isArray(session.exercises)) {
        session.exercises.forEach((ex) => {
          if (ex.muscle) trainedMuscles.add(ex.muscle.toLowerCase())
        })
      }

      trainedMuscles.forEach((muscle) => {
        let key = muscle
        if (['core'].includes(muscle)) key = 'abs'
        if (['lats', 'traps'].includes(muscle)) key = 'back'
        if (['legs'].includes(muscle)) {
          if (muscleLastTrained.quads === null) muscleLastTrained.quads = sessionDate
          if (muscleLastTrained.hamstrings === null) muscleLastTrained.hamstrings = sessionDate
          return
        }
        if (['arms'].includes(muscle)) {
          if (muscleLastTrained.biceps === null) muscleLastTrained.biceps = sessionDate
          if (muscleLastTrained.triceps === null) muscleLastTrained.triceps = sessionDate
          return
        }

        if (muscleLastTrained[key] === null) {
          muscleLastTrained[key] = sessionDate
        }
      })
    }

    const result = {}
    Object.keys(muscleLastTrained).forEach((muscle) => {
      const lastTime = muscleLastTrained[muscle]
      if (!lastTime) {
        result[muscle] = { hours: null, status: 'fresh', color: RECOVERY_COLORS.fresh }
        return
      }

      const diffHours = Math.max(0, (now - lastTime) / (1000 * 60 * 60))
      if (diffHours < 24) {
        result[muscle] = { hours: Math.round(diffHours), status: 'recovering', color: RECOVERY_COLORS.recovering }
      } else if (diffHours < 48) {
        result[muscle] = { hours: Math.round(diffHours), status: 'rebuilding', color: RECOVERY_COLORS.rebuilding }
      } else {
        result[muscle] = { hours: Math.round(diffHours), status: 'fresh', color: RECOVERY_COLORS.fresh }
      }
    })

    return result
  }, [history])

  return (
    <div className="floating-recovery-wrapper">
      {/* Floating 3D Canvas */}
      <div className="canvas-frameless-container">
        <Canvas
          camera={{ position: [0, 0, 2.1], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: '100%', height: '700px', background: 'transparent' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 6, 4]} intensity={2.2} />
          <directionalLight position={[-4, 3, -3]} intensity={1.4} color="#94a3b8" />
          <pointLight position={[0, -2, 2]} intensity={0.5} />

          <Suspense fallback={null}>
            <ModelMannequin
              recoveryStatus={recoveryStatus}
              hoveredMuscle={hoveredMuscle}
              onHoverMuscle={setHoveredMuscle}
            />
          </Suspense>

          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={true}
            minDistance={1.4}
            maxDistance={3.5}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Centered Recovery Legend Placed Underneath */}
      <div className="centered-legend-badge">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: RECOVERY_COLORS.recovering }} />
          <span>0 – 24h (Fatigued)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: RECOVERY_COLORS.rebuilding }} />
          <span>24 – 48h (Rebuilding)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: RECOVERY_COLORS.fresh }} />
          <span>48h+ (Recovered)</span>
        </div>
      </div>
    </div>
  )
}