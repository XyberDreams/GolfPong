export const SHOT_EVENTS = {
  Hit: { message: "Nice Hit!", sfx: "hit" },
  ShortMiss: { message: "Missed! Too Short", sfx: "miss_short" },
  LongMiss: { message: "Missed! Too Long", sfx: "miss_long" },
  "3Streak": { message: "3 In a Row! You're on Fire!", sfx: "streak3" },
  "5Streak": { message: "5 In a Row! Unstoppable!", sfx: "streak5" },
  "6Streak": { message: "Perfect Game! All Holes Hit!", sfx: "perfect" },
  GameOver: { message: "Game Over! Buy Golf Pong Now!", sfx: "gameover" },
} as const;

export type ShotEventKey = keyof typeof SHOT_EVENTS;