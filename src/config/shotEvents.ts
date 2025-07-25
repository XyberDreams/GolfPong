export const SHOT_EVENTS = {
  Hit: { message: "Nice Hit!", sfx: "hit" },
  Miss: { message: "Ball Missed!", sfx: "hit" },
  AlreadyHit: { message: "Hole Already Hit!", sfx: "hit" },
  ShortMiss: { message: "Ball Short!", sfx: "hit" },
  LongMiss: { message: "Ball Long!", sfx: "hit" },
  "3Streak": { message: "TRIPLE!", sfx: "swing_success" },
  "5Streak": { message: "PENTA!", sfx: "swing_success2" },
  "6Streak": { message: "Perfect Game!", sfx: "swing_success3" },
  GameOver: { message: "Game Over!", sfx: "gameover" },
} as const;

export type ShotEventKey = keyof typeof SHOT_EVENTS;