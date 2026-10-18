export const ROUTINE_SPLITS = [
  {
    id: 'ppl',
    name: 'PPL (Push Pull Leg)',
    description: 'A classic 6-day hypertrophy split focusing on pushing movements, pulling movements, and lower body development.',
    days: {
      1: { name: 'Legs 1 (Quads Focus)', exercises: ['barbell-squat', 'machine-leg-extension', 'seated-leg-curl', 'standing-machine-calf-raises', 'decline-bench-crunches', 'hanging-leg-raises'] },
      2: { name: 'Push 1 (Chest Focus)', exercises: ['incline-smith-machine-press', 'machine-shoulder-press', 'pec-deck-machine-fly', 'barbell-skull-crusher', 'cable-lateral-raises', 'one-arm-tricep-extension'] },
      3: { name: 'Pull 1 (Lat Focus)', exercises: ['pull-ups', 'seated-cable-rows', 'cable-rope-lat-push-downs', 'dumbbell-hammer-curls', 'incline-bench-dumbbell-curls'] },
      4: { name: 'Legs 2 (Hamstring Focus)', exercises: ['machine-hack-squat', 'barbell-hip-thrust', 'seated-leg-curl', 'seated-machine-calf-raises', 'machine-crunches', 'decline-bench-leg-raises'] },
      5: { name: 'Push 2 (Shoulder Focus)', exercises: ['machine-shoulder-press', 'smith-machine-bench-press', 'low-to-high-cable-fly', 'overhead-tricep-extension', 'dumbbell-lateral-raises', 'machine-reverse-delt-fly'] },
      6: { name: 'Pull 2 (Mid Back Focus)', exercises: ['lats-pull-down', 'machine-rows', 'barbell-bent-over-rows', 'single-arm-preacher-curls', 'rope-face-pulls'] },
      7: { name: 'Rest / Optional', exercises: [] }
    }
  },
  {
    id: 'bro-split',
    name: 'Bro Split',
    description: 'A classic 5-day bodybuilding split dedicating each day to a single major muscle group.',
    days: {
      1: { name: 'Chest / Abs', exercises: ['barbell-bench-press', 'high-to-low-cable-fly', 'incline-machine-press', 'pec-deck-machine-fly', 'machine-crunches'] },
      2: { name: 'Back', exercises: ['barbell-bent-over-rows', 'pull-ups', 'seated-cable-rows', 'cable-rope-lat-push-downs'] },
      3: { name: 'Shoulders / Calves', exercises: ['machine-press', 'dumbbell-lateral-raises', 'machine-reverse-delt-fly', 'seated-machine-calf-raises'] },
      4: { name: 'Arms', exercises: ['rope-tricep-extension', 'dumbbell-hammer-curls', 'barbell-curls', 'barbell-skull-crusher', 'bayesian-curls'] },
      5: { name: 'Legs', exercises: ['barbell-squat', 'seated-leg-curl', 'machine-leg-press', 'machine-leg-extension'] },
      6: { name: 'Rest', exercises: [] },
      7: { name: 'Rest', exercises: [] }
    }
  },
  {
    id: 'full-body',
    name: 'Full Body Split',
    description: 'A high-frequency 2-option full body routine designed for balanced muscle stimulation across every session.',
    days: {
      1: { name: 'Full Body A', exercises: ['incline-smith-machine-press', 'chest-supported-t-bar-rows', 'lats-pull-down', 'barbell-squat', 'cable-lateral-raises', 'barbell-skull-crusher', 'machine-press', 'single-arm-preacher-curls', 'machine-leg-extension', 'seated-machine-calf-raises', 'machine-crunches'] },
      2: { name: 'Rest', exercises: [] },
      3: { name: 'Full Body B', exercises: ['machine-hack-squat', 'pull-ups', 'machine-press', 'low-to-high-cable-fly', 'seated-leg-curl', 'machine-reverse-delt-fly', 'barbell-press', 'rope-tricep-extension', 'rope-hammer-curls', 'seated-machine-calf-raises', 'hanging-leg-raises'] },
      4: { name: 'Rest', exercises: [] },
      5: { name: 'Full Body (Optional)', exercises: ['barbell-bench-press', 'barbell-bent-over-rows', 'machine-leg-press', 'seated-machine-calf-raises'] },
      6: { name: 'Rest', exercises: [] },
      7: { name: 'Rest', exercises: [] }
    }
  },
  {
    id: 'upper-lower',
    name: 'Upper Lower Split',
    description: 'A 4-day frequency split alternating between upper body pressing/pulling and lower body power.',
    days: {
      1: { name: 'Upper 1', exercises: ['dumbbell-bench-press', 'dumbbell-bent-over-rows', 'pec-deck-machine-fly', 'lats-pull-down', 'cable-press-down', 'dumbbell-lateral-raises', 'rope-hammer-curls'] },
      2: { name: 'Lower 1', exercises: ['barbell-squat', 'barbell-hip-thrust', 'machine-leg-extension', 'seated-leg-curl', 'standing-machine-calf-raises', 'machine-crunches'] },
      3: { name: 'Rest', exercises: [] },
      4: { name: 'Upper 2', exercises: ['barbell-overhead-press', 'pull-ups', 'incline-dumbbell-bench-press', 'seated-cable-rows', 'barbell-skull-crusher', 'cable-lateral-raises', 'single-arm-preacher-curls'] },
      5: { name: 'Lower 2', exercises: ['machine-leg-press', 'reverse-hack-squat', 'machine-leg-extension', 'seated-leg-curl', 'standing-machine-calf-raises', 'hanging-leg-raises'] },
      6: { name: 'Rest', exercises: [] },
      7: { name: 'Rest', exercises: [] }
    }
  },
  {
    id: 'ul-ppl',
    name: 'UL / PPL Hybrid',
    description: 'A hybrid 5-day routine combining Upper/Lower foundational days with Push/Pull/Legs refinement.',
    days: {
      1: { name: 'Upper', exercises: ['incline-barbell-bench-press', 'pec-deck-machine-fly', 'pull-ups', 'cable-lateral-raises', 'barbell-bent-over-rows', 'overhead-tricep-extension', 'bayesian-curls'] },
      2: { name: 'Lower', exercises: ['seated-leg-curl', 'machine-hack-squat', 'romanian-deadlift-rdl', 'machine-leg-extension', 'hip-abduction-machine', 'standing-machine-calf-raises'] },
      3: { name: 'Push', exercises: ['incline-dumbbell-bench-press', 'machine-shoulder-press', 'pec-deck-machine-fly', 'dumbbell-lateral-raises', 'one-arm-tricep-extension', 'overhead-tricep-extension'] },
      4: { name: 'Pull', exercises: ['close-grip-pull-down', 'machine-rows', 'seated-cable-rows', 'machine-reverse-delt-fly', 'barbell-curls', 'machine-preacher-curls'] },
      5: { name: 'Legs', exercises: ['lever-bent-over-leg-curl', 'smith-machine-squats', 'barbell-hip-thrust', 'machine-leg-extension', 'hip-adduction-machine', 'standing-machine-calf-raises'] },
      6: { name: 'Rest', exercises: [] },
      7: { name: 'Rest', exercises: [] }
    }
  },
  {
    id: 'arnold-split',
    name: 'Arnold Split',
    description: 'The legendary 6-day split pairing Chest/Back, Shoulders/Arms, and Legs.',
    days: {
      1: { name: 'Chest / Back 1', exercises: ['dumbbell-bench-press', 'chest-supported-t-bar-rows', 'low-to-high-cable-fly', 'lats-pull-down', 'hanging-leg-raises'] },
      2: { name: 'Shoulders / Arms 1', exercises: ['machine-press', 'barbell-curls', 'overhead-tricep-extension', 'dumbbell-lateral-raises', 'incline-bench-dumbbell-curls'] },
      3: { name: 'Legs 1', exercises: ['barbell-squat', 'romanian-deadlift-rdl', 'machine-leg-extension', 'seated-leg-curl', 'standing-machine-calf-raises'] },
      4: { name: 'Chest / Back 2', exercises: ['incline-dumbbell-bench-press', 'seated-cable-rows', 'pec-deck-machine-fly', 'lats-pull-down', 'machine-crunches'] },
      5: { name: 'Shoulders / Arms 2', exercises: ['rope-face-pulls', 'rope-hammer-curls', 'cable-press-down', 'cable-lateral-raises', 'machine-preacher-curls'] },
      6: { name: 'Legs 2', exercises: ['smith-machine-squats', 'lunges', 'machine-leg-extension', 'seated-leg-curl', 'standing-machine-calf-raises'] },
      7: { name: 'Rest', exercises: [] }
    }
  }
];