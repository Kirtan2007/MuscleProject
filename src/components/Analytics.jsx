import React, { useEffect } from 'react'
import ActivityHeatmap from './ActivityHeatmap'
import ProgressionGraph from './ProgressionGraph'
import MuscleBalanceDistribution from './MuscleBalanceDistribution'

export default function Analytics({
  history,
  targetMuscle = 'All',
  showBackToModel = false,
  onBackToModel
}) {
  // Smooth scroll down to frame the return button + graph card together
  useEffect(() => {
    if (showBackToModel) {
      const timer = setTimeout(() => {
        const graphContainer = document.getElementById('progression-graph-wrapper')
        if (graphContainer) {
          graphContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [showBackToModel])

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <h2>Workout Analytics</h2>
        <p className="analytics-subtitle">
          Track your training consistency, muscle progression, and workload over time.
        </p>
      </div>

      <div className="analytics-content">
        {/* V5.1: Activity Heatmap */}
        <ActivityHeatmap history={history} />

        {/* V5.2: Muscle Group Progression Graph with contextual Back Button */}
        <div id="progression-graph-wrapper" style={{ scrollMarginTop: '24px' }}>
          {showBackToModel && (
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={onBackToModel}
                className="back-to-model-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#38bdf8',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ← Back to 3D Model
              </button>
            </div>
          )}

          <ProgressionGraph history={history} targetMuscle={targetMuscle} />
        </div>

        {/* V5.3: Muscle Training Balance Breakdown */}
        <MuscleBalanceDistribution history={history} />
      </div>
    </section>
  )
}