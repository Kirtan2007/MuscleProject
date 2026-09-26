import barbellRow from '../assets/exercises/barbell-row.jpg'
import benchPress from '../assets/exercises/bench-press.jpg'
import bicepCurls from '../assets/exercises/bicep-curls.jpg'
import inclineDumbbellPress from '../assets/exercises/incline-dumbbell-press.jpg'
import lateralRaises from '../assets/exercises/lateral-raises.jpg'
import legPress from '../assets/exercises/leg-press.jpg'
import pullUps from '../assets/exercises/pull-ups.jpg'
import shoulderPress from '../assets/exercises/shoulder-press.jpg'
import squats from '../assets/exercises/squats.jpg'
import tricepPushdown from '../assets/exercises/tricep-pushdown.jpg'
import cableFlyes from '../assets/exercises/cable-flyes.jpg'
import latPulldown from '../assets/exercises/lat-pulldown.jpg'
import facePulls from '../assets/exercises/face-pulls.jpg'
import hammerCurls from '../assets/exercises/hammer-curls.jpg'
import skullCrushers from '../assets/exercises/skull-crushers.jpg'
import romanianDeadlift from '../assets/exercises/romanian-deadlift.jpg'

const exercises = [
  {
    id: 1,
    name: 'Bench Press',
    muscle: 'Chest',
    subGroup: 'Mid Chest',
    equipment: 'Barbell',
    image: benchPress
  },
  {
    id: 2,
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    subGroup: 'Upper Chest',
    equipment: 'Dumbbell',
    image: inclineDumbbellPress
  },
  {
    id: 3,
    name: 'Pull Ups',
    muscle: 'Back',
    subGroup: 'Lats',
    equipment: 'Bodyweight',
    image: pullUps
  },
  {
    id: 4,
    name: 'Barbell Row',
    muscle: 'Back',
    subGroup: 'Upper Back',
    equipment: 'Barbell',
    image: barbellRow
  },
  {
    id: 5,
    name: 'Shoulder Press',
    muscle: 'Shoulders',
    subGroup: 'Front Delt',
    equipment: 'Dumbbell',
    image: shoulderPress
  },
  {
    id: 6,
    name: 'Lateral Raises',
    muscle: 'Shoulders',
    subGroup: 'Side Delt',
    equipment: 'Dumbbell',
    image: lateralRaises
  },
  {
    id: 7,
    name: 'Bicep Curls',
    muscle: 'Arms',
    subGroup: 'Biceps',
    equipment: 'Dumbbell',
    image: bicepCurls
  },
  {
    id: 8,
    name: 'Tricep Pushdown',
    muscle: 'Arms',
    subGroup: 'Triceps',
    equipment: 'Cable',
    image: tricepPushdown
  },
  {
    id: 9,
    name: 'Squats',
    muscle: 'Legs',
    subGroup: 'Quads',
    equipment: 'Barbell',
    image: squats
  },
  {
    id: 10,
    name: 'Leg Press',
    muscle: 'Legs',
    subGroup: 'Quads',
    equipment: 'Machine',
    image: legPress
  },
  {
    id: 11,
    name: 'Cable Flyes',
    muscle: 'Chest',
    subGroup: 'Inner/Mid Chest',
    equipment: 'Cable',
    image: cableFlyes
  },
  {
    id: 12,
    name: 'Lat Pulldown',
    muscle: 'Back',
    subGroup: 'Lats',
    equipment: 'Cable',
    image: latPulldown
  },
  {
    id: 13,
    name: 'Face Pulls',
    muscle: 'Shoulders',
    subGroup: 'Rear Delt',
    equipment: 'Cable',
    image: facePulls
  },
  {
    id: 14,
    name: 'Hammer Curls',
    muscle: 'Arms',
    subGroup: 'Biceps & Forearms',
    equipment: 'Dumbbell',
    image: hammerCurls
  },
  {
    id: 15,
    name: 'Skull Crushers',
    muscle: 'Arms',
    subGroup: 'Triceps',
    equipment: 'Barbell',
    image: skullCrushers
  },
  {
    id: 16,
    name: 'Romanian Deadlift',
    muscle: 'Legs',
    subGroup: 'Hamstrings & Glutes',
    equipment: 'Barbell',
    image: romanianDeadlift
  }
]

export default exercises