import React from 'react'
import ActivityHeatmap from './ActivityHeatmap'
import ProgressionGraph from './ProgressionGraph'
import MuscleBalanceDistribution from './MuscleBalanceDistribution'

export default function Analytics({ history = [] }) {
  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <h2>Workout Analytics</h2>
        <p className="analytics-subtitle">Track your training consistency, muscle progression, and workload over time.</p>
      </div>

      <div className="analytics-content">
        {/* V5.1: Activity Heatmap */}
        <ActivityHeatmap history={history} />

        {/* V5.2: Muscle Group Progression Graph & Exercise Drilldown */}
        <ProgressionGraph history={history} />

        {/* V5.3: Muscle Training Balance Breakdown */}
        <MuscleBalanceDistribution history={history} />
      </div>
    </section>
  )
}