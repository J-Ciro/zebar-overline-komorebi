import { AnimatePresence, motion } from "framer-motion";
import { Volume, Volume1, Volume2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";
import { Chip } from "../common/Chip";
import Slider from "./components/Slider";

interface VolumeControlProps {
  playbackDevice: {
    volume: number;
  } | null;
  setVolume: (volume: number) => void;
  statIconClassnames: string;
}

export default function VolumeControl({
  playbackDevice,
  statIconClassnames,
  setVolume,
}: VolumeControlProps) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLButtonElement>) => {
    if (!playbackDevice) return;

    const delta = e.deltaY > 0 ? -3 : 3;
    setVolume(Math.min(Math.max(playbackDevice.volume + delta, 0), 100));
  }, [playbackDevice, setVolume]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!playbackDevice) return;

    if (e.shiftKey) {
      setVolume(playbackDevice.volume === 0 ? 100 : 0);
      return;
    }

    setExpanded(prev => !prev);
  }, [playbackDevice, setVolume]);

  const renderIcon = useCallback(() => {
    if (!playbackDevice) return null;
    
    const volume = playbackDevice.volume;
    const iconProps = {
      className: cn(
        statIconClassnames,
        "transition-colors duration-200"
      ),
      size: 16,
      strokeWidth: 3
    };

    if (volume === 0) {
      return <Volume {...iconProps} />;
    } else if (volume < 60) {
      return <Volume1 {...iconProps} />;
    } else {
      return <Volume2 {...iconProps} />;
    }
  }, [playbackDevice, statIconClassnames]);

  const chipClassName = useMemo(() => 
    cn(
      "outline-none px-2 pr-2.5",
      "active:bg-background-deeper/50"
    ),
    []
  );

  const sliderContainerClassName = useMemo(() => 
    cn(
      "transition-all duration-200 ease-in-out mx-1 w-full",
      expanded && "mx-1.5"
    ),
    [expanded]
  );

  // Close the slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Chip
      ref={ref}
      as="button"
      onClick={handleClick}
      onWheel={handleWheel}
      className={chipClassName}
    >
      <div className="flex items-center">
        <div>{renderIcon()}</div>

        <div className={sliderContainerClassName}>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
                transition={{ 
                  type: "spring", 
                  duration: 0.4, 
                  bounce: 0,
                  stiffness: 200,
                  damping: 20
                }}
              >
                <Slider value={playbackDevice?.volume ?? 0} setValue={setVolume} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          
        >
          {playbackDevice?.volume ?? 0}%
        </motion.p>
      </div>
    </Chip>
  );
}
