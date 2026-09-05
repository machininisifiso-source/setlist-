import { Preset } from "./types";

export const PRESETS: Preset[] = [
  {
    id: "hiit20",
    name: "HIIT Blast",
    tagline: "20 min · full body · no equipment",
    color: "#FF4D2E",
    exercises: [
      { name: "Jumping Jacks", mode: "time", work: 40, rest: 20 },
      { name: "High Knees", mode: "time", work: 40, rest: 20 },
      { name: "Push-Ups", mode: "time", work: 40, rest: 20 },
      { name: "Mountain Climbers", mode: "time", work: 40, rest: 20 },
      { name: "Squat Jumps", mode: "time", work: 40, rest: 20 },
      { name: "Plank Hold", mode: "time", work: 40, rest: 20 },
    ],
  },
  {
    id: "core10",
    name: "Core Crusher",
    tagline: "10 min · abs & obliques",
    color: "#2E6BFF",
    exercises: [
      { name: "Crunches", mode: "time", work: 30, rest: 15 },
      { name: "Bicycle Crunches", mode: "time", work: 30, rest: 15 },
      { name: "Russian Twists", mode: "time", work: 30, rest: 15 },
      { name: "Leg Raises", mode: "time", work: 30, rest: 15 },
      { name: "Plank", mode: "time", work: 30, rest: 15 },
    ],
  },
  {
    id: "morning7",
    name: "Morning Wake-Up",
    tagline: "7 min · low impact stretch",
    color: "#22C55E",
    exercises: [
      { name: "Arm Circles", mode: "time", work: 30, rest: 10 },
      { name: "Cat-Cow Stretch", mode: "time", work: 30, rest: 10 },
      { name: "Bodyweight Squats", mode: "time", work: 30, rest: 10 },
      { name: "Standing Side Bend", mode: "time", work: 30, rest: 10 },
    ],
  },
  {
    id: "strength5",
    name: "Strength Sets",
    tagline: "5 moves · rep-based",
    color: "#C77DFF",
    exercises: [
      { name: "Push-Ups", mode: "reps", reps: 15, rest: 30 },
      { name: "Bodyweight Squats", mode: "reps", reps: 20, rest: 30 },
      { name: "Lunges (each leg)", mode: "reps", reps: 12, rest: 30 },
      { name: "Sit-Ups", mode: "reps", reps: 15, rest: 30 },
      { name: "Glute Bridges", mode: "reps", reps: 20, rest: 0 },
    ],
  },
];
