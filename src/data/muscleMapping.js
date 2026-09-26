// src/data/muscleMapping.js
export const BEACON_TO_GRAPH_KEY = {
  chest: 'Chest',
  abs: 'Core',
  shoulders: 'Shoulders',
  biceps: 'Arms',
  triceps: 'Arms',
  forearms: 'Arms',
  quads: 'Legs',
  hamstrings: 'Legs',
  calves: 'Legs',
  back: 'Back',
  lower_back: 'Back'
}

export function mapBeaconToGraphMuscle(beaconId) {
  if (!beaconId) return 'All'
  return BEACON_TO_GRAPH_KEY[beaconId.toLowerCase()] || 'All'
}