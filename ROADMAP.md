MUSCLEPROJECT: OFFICIAL PRODUCT ARCHITECTURE & MULTI-VERSION ROADMAP

Project Name: MuscleProject
Author: Kirtan
Core Tech Stack: React 18+ (Vite), Vanilla CSS, HTML5, LocalStorage, Git
Repository: https://github.com/Kirtan2007/MuscleProject (Branch: 'main')
Design Philosophy: Device-Specialized Utility (Desktop Planner & Analytics Command Center + Minimalist Mobile Gym Session Runner)

================================================================================
1. CORE ARCHITECTURE PRINCIPLES & SYSTEM RULES
================================================================================
• Device Split Rule:
  Mobile viewport is strictly optimized as an active gym floor interface (large touch-targets, checkable sets, distraction-free logging). Desktop viewport is optimized as the comprehensive management and analytics center (routine building, deep history logs, and recovery maps).

• Immutable Template Rule:
  Active gym sessions never directly mutate the saved routine template. The routine defines what was planned; active workouts record what was actually performed using deep isolation (structuredClone).

• Progressive Scope Execution:
  Development is split into distinct version cycles to maintain code clarity, prevent regressions, and ensure complete stability at each milestone.

================================================================================
2. COMPLETE MULTI-VERSION ROADMAP (V1 - V8)
================================================================================

--------------------------------------------------------------------------------
V1: THE ROUTINE BUILDER & EXERCISE LIBRARY
Status: 100% Completed & Verified
--------------------------------------------------------------------------------
• Exercise Selector:
  - Curated exercise database with categorized imagery.
  - Real-time search by exercise title.
  - Muscle category filtering (Chest, Back, Shoulders, Arms, Legs, Core).

• 7-Day Split Builder:
  - Routine canvas allowing exercise assignments across days 1 through 7.
  - Inline custom day renaming (e.g., "Day 1" to "Push Day") with local persistence.
  - Reversible exercise assignment workflow with dedicated Done/Cancel snapshot restoration.

• Set & Rep Management System:
  - Up to 4 sets per exercise with auto-renumbering upon deletion.
  - Dynamic cloning of rep/load values when adding new sets.
  - Form input UX: auto-clearing placeholder zero on focus, safe fallback on blur, and unit indicators (kg, reps).

• Day-Level Controls & Local Storage:
  - Clear Day action with verification check.
  - Copy Day modal allowing single-click replication of daily templates.
  - Local browser persistence for routines ('muscleproject_workout') and custom labels ('muscleproject_day_names').

--------------------------------------------------------------------------------
V2: THE MOBILE GYM SESSION RUNNER
Status: 100% Completed & Verified
--------------------------------------------------------------------------------
• Responsive Access Control:
  - Media-query and pointer-detection gating (@media (max-width: 768px) and (pointer: coarse)) ensuring the "Start Workout" launcher displays exclusively on mobile touch screens and remains hidden on desktop.

• Isolated Active Workout Runner (ActiveWorkout.jsx):
  - Full-screen mobile focus shell taking over the viewport during live gym training.
  - Live elapsed workout session timer (HH:MM:SS) tracking total floor time.
  - Touch-optimized set checklist rows with immediate visual completion state (green accenting, input lock, and checkmark feedback).
  - Column layout optimized for rapid logging: Set Number | Reps | Load (kg) | Done Toggle.

• Target Reps Validation Engine:
  - Template preservation: planned routine reps stored as baseline targets (targetReps).
  - Target verification: automated evaluation marking sets as "Target Hit" when logged repetitions equal or exceed the scheduled template (reps >= targetReps).

• Session Persistence:
  - Non-destructive completion pipeline logging active duration, completed sets count, targets met, and exercise details into localStorage under 'muscleproject_history'.

--------------------------------------------------------------------------------
V3: THE DESKTOP COMMAND CENTER & RECOVERY ENGINE
Status: Scheduled Next Up
--------------------------------------------------------------------------------
• Desktop Workout History Drawer & Log Viewer:
  - Dedicated "History" navigation tab inside the primary desktop interface.
  - Chronological session history cards displaying day title, completion date, elapsed duration, sets completed ratio, and target hit counters.
  - Expandable session breakdown showing every individual exercise, performed loads, rep counts, and target hit badges.
  - History management tools (individual session deletion and full history clear).

• Interactive SVG Muscle Recovery Heatmap:
  - Dual-perspective anatomical human body map (anterior/front and posterior/back) rendered in vector SVG.
  - Algorithmic fatigue mapping parsing muscle groups trained in 'muscleproject_history'.
  - Dynamic color-coded recovery states:
    * Red (Exhausted / Worked): Trained within the last 0–48 hours.
    * Yellow (Recovering): Trained 48–72 hours ago.
    * Green (Fully Recovered / Prime): Untrained for 72+ hours, ready for maximum intensity.

--------------------------------------------------------------------------------
V4: CLOUD ARCHITECTURE & MULTI-DEVICE SYNCHRONIZATION
Status: Planned
--------------------------------------------------------------------------------
• Authentication & User Profiles:
  - Secure user sign-up, login, and session persistence (Email/Password or OAuth via Supabase or Firebase Auth).
  - Isolated user profiles ensuring personal splits and workout data remain private.

• Cloud Database Layer:
  - Real-time remote database integration replacing standalone browser localStorage.
  - Multi-device synchronization: build and fine-tune your routine templates on a desktop laptop, walk into the gym, and have the exact routine instantly appear on your mobile phone.

• Progressive Web App (PWA) & Offline Reliability:
  - Web App Manifest and Service Worker caching allowing MuscleProject to be installed directly to home screens as a native-like mobile app.
  - Offline-first data caching to prevent loss of workout data if gym cellular reception drops.

--------------------------------------------------------------------------------
V5: ANALYTICS, PROGRESSIVE OVERLOAD & PR TRACKING
Status: Planned
--------------------------------------------------------------------------------
• Personal Record (PR) Engine:
  - Automated background detection comparing finished sets against all historical data.
  - All-time PR badges for single-rep maxes, highest weight lifted per exercise, and maximum set volume.

• Visual Progress & Trend Analytics:
  - Interactive line and bar charts tracking load progression, total tonnage, and repetition endurance over weeks and months.
  - Exercise-specific historical charts showing strength curves across time.

• Target Auto-Increment (Progressive Overload Advisor):
  - Automated training recommendations: when all sets for an exercise hit target reps across consecutive sessions, the system suggests a calibrated load increase (e.g., +2.5 kg).

--------------------------------------------------------------------------------
V6: SOCIAL ECOSYSTEM & DATA PORTABILITY
Status: Planned
--------------------------------------------------------------------------------
• Routine Sharing:
  - Shareable workout links and scannable QR codes allowing other users to preview and import full 7-day routine structures into their own accounts with one click.

• Data Portability & Backup:
  - Full data export to standard formats (CSV, Excel, JSON) for independent training logs and external spreadsheets.
  - Backup restore and import tooling to easily migrate workout histories.

--------------------------------------------------------------------------------
V7: EDGE-CASE HARDENING & UX POLISH
Status: Planned
--------------------------------------------------------------------------------
• Custom Design System Modals:
  - Complete removal of all native browser dialogs (window.alert, window.confirm, window.prompt).
  - Custom accessible dark-themed modals matching the core aesthetic for workout summaries, deletion confirmations, and errors.

• Accessibility & Form Refinements:
  - Standardized form field labels, name, and id attributes across all interactive inputs to meet full WCAG accessibility standards.
  - Fluid micro-animations, loading skeletons, and interactive state transitions.

--------------------------------------------------------------------------------
V8: PRODUCTION HARDENING, OPTIMIZATION & LAUNCH
Status: Final Release
--------------------------------------------------------------------------------
• Build Optimization & Code Splitting:
  - Vite production bundling optimization, route/component lazy loading, and asset minification for sub-second initial loads.

• SEO, Metadata & Branding:
  - Dynamic Open Graph social preview tags, high-resolution favicons, and clear technical metadata.

• Production Deployment:
  - Continuous Integration and Continuous Deployment (CI/CD) via Vercel or Netlify connected directly to GitHub 'main'.
  - Custom domain configuration and final production release verification.