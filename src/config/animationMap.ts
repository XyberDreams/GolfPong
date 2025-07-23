type ShotType = "default" | "shotPerfect" | "shotShort" | "shotLong";
type Direction = "left" | "center" | "right";

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
    return `shotperfect${holeIdx + 1}`;
  }
  if (shotType === "shotShort" && direction && holeIdx !== null) {
    // e.g. "missShortLeft1", "missShortCenter3", etc.
    return `missShort_${direction}_${holeIdx + 1}`;
  }
  if (shotType === "shotLong" && direction && holeIdx !== null) {
    return `missLong_${direction}_${holeIdx + 1}`;
  }
  return null;
}