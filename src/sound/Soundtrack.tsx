import { useRef, useEffect } from "react";
import useExperience from "../hooks/useExperience";

const Soundtrack = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { bgMusicPlaying, isMuted } = useExperience();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.1;
    audio.loop = true;
    audio.muted = isMuted;
    if (bgMusicPlaying && !isMuted) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [bgMusicPlaying, isMuted, src]);

  return (
    <audio
      ref={audioRef}
      src={src}
      style={{ display: "none" }}
      preload="auto"
      loop
    />
  );
};

export default Soundtrack;