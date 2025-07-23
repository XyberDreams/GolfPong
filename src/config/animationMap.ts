type ShotType = "default" | "shotPerfect" | "shotShort" | "shotLong";
type Direction = "left" | "center" | "right";

function directionToIdx(direction: Direction): number {
  if (direction === "left") return 1;
  if (direction === "center") return 2;
  if (direction === "right") return 3;
  return 1; // fallback
}

export function getAnimationName({
  direction,
  shotType,
  holeIdx,
}: {
  direction: Direction;
  shotType: ShotType;
  holeIdx: number | null;
}) {
  if (shotType === "shotPerfect" && holeIdx !== null) {
    // e.g. "hitHole1", "hitHole2", ...
    return `shotPerfect${holeIdx + 1}`;
  }
  if (shotType === "shotShort" && direction) {
    // e.g. "missShortLeft1", "missShortCenter3", etc.
    return `shotShort${directionToIdx(direction)}`;
  }
  if (shotType === "shotLong" && direction) {
     return `shotLong${directionToIdx(direction)}`;
  }
  return null;
}