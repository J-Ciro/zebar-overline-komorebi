import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayPause } from "../../../utils/usePlayPause";
import { cn } from "../../../utils/cn";

export enum PlayPauseState {
  Played = "played",
}

export enum StatusAction {
  Previous = "previous",
  Next = "next",
  Switch = "switch",
}

const iconVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1.1 },
  exit: { opacity: 0, scale: 0.5 }
};

export function Status({ isPlaying }: { isPlaying: boolean }) {
  const { isPlaying: state, statusAction: trackAction } = usePlayPause(isPlaying);
  const icon = getIcon(trackAction, state);
  const key = trackAction ?? (state ? "pause" : "play");

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5
        }}
        className="relative"
      >
        <PlayPauseIcon LucideIcon={icon} />
      </motion.div>
    </AnimatePresence>
  );
}

function getIcon(
  trackAction: StatusAction | null,
  state: boolean
): typeof Play | typeof Pause | typeof SkipBack | typeof SkipForward | typeof ArrowDownUp {
  if (trackAction === StatusAction.Previous) return SkipBack;
  if (trackAction === StatusAction.Next) return SkipForward;
  return state ? Pause : Play;
}

function PlayPauseIcon({ LucideIcon }: { LucideIcon: typeof Play | typeof Pause | typeof SkipBack | typeof SkipForward | typeof ArrowDownUp }) {
  return (
    <LucideIcon
      className={cn(
        "h-3 w-3 text-icon",
        "transition-colors duration-200"
      )}
      strokeWidth={3}
    />
  );
}
