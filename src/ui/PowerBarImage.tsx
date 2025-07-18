export default function PowerBarImage() {
  return (
    <img
      src="/golfpong/power_bar2.png"
      alt="Power Bar"
      style={{
        width: "100%",      // or set a fixed width like "300px"
        maxWidth: 400,      // adjust as needed
        display: "block",
        margin: "0 auto",   // center horizontally
        pointerEvents: "none"
      }}
    />
  );
}