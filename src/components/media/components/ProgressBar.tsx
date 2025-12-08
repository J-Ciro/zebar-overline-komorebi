import { useState, useEffect, useCallback, useMemo } from "react";
import { MediaSession } from "zebar";
import { motion } from "framer-motion";

export function ProgressBar({
  currentSession,
}: {
  currentSession: MediaSession | undefined;
}) {
  const [progress, setProgress] = useState<number>(
    currentSession?.position ?? 0
  );

  const progressPercentage = useMemo(() => 
    currentSession
      ? `${(progress / currentSession?.endTime) * 100 || 0}%`
      : "0%",
    [progress, currentSession]
  );

  const updateProgress = useCallback(() => {
    if (!currentSession?.position) {
      setProgress(0);
      return;
    }

    setProgress(currentSession.position);
  }, [currentSession]);

  useEffect(() => {
    updateProgress();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (!currentSession?.isPlaying) return prev;
        if (prev < (currentSession?.endTime ?? 0)) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, updateProgress]);

  return (
    <motion.div
      className="absolute h-[2px] bg-primary/80 bottom-0 left-0"
      style={{
        width: progressPercentage,
      }}
      initial={{ width: 0 }}
      animate={{ width: progressPercentage }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        mass: 0.5,
      }}
    />
  );
}
