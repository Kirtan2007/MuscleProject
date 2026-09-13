function MuscleFilter({ selectedMuscle, setSelectedMuscle }) {
  const muscles = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs']

  return (
    <div className="filter-section">
      <div className="filter-buttons">
        {muscles.map((muscle) => (
          <button
            key={muscle}
            className={selectedMuscle === muscle ? 'active-filter' : ''}
            onClick={() => setSelectedMuscle(muscle)}
          >
            {muscle}
          </button>
        ))}
      </div>

      <p>Selected muscle: {selectedMuscle}</p>
    </div>
  )
}

export default MuscleFilter