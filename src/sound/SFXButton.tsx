import useExperience from "../hooks/useExperience";

const SFX_LIST = [
  { name: "Swing", sfx: "swing" },
  { name: "Swing2", sfx: "swing2" },
  { name: "New Turn", sfx: "new_turn" },
  { name: "New Turn 2", sfx: "new_turn2" },
];

export default function SFXButtons() {
  const { playSFX } = useExperience();

  return (
    <div style={{ display: "flex", gap: 16, margin: "24px 0" }}>
      {SFX_LIST.map(({ name, sfx }) => (
        <button
          key={sfx}
          onClick={() => playSFX(sfx)}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}