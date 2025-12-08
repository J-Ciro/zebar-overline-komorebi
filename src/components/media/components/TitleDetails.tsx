import { memo } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import { useConfig } from "../../../context/ConfigContext";

interface TitleDetailsProps {
  title?: string | null;
  artist?: string | null;
  isPlaying?: boolean;
}

export const TitleDetails = memo(function TitleDetails({
  title,
  artist,
  isPlaying = true,
}: TitleDetailsProps) {
  const { mediaMaxWidth } = useConfig();
  const displayText = [artist, title].filter(Boolean).join(" • ");

  if (!displayText) return null;

  const containerStyle = {
    width: "fit-content",
    maxWidth: mediaMaxWidth ? `${mediaMaxWidth}px` : "100%",
    minWidth: "250px",
  };

  return (
    <div
      style={containerStyle}
      className={cn(
        "flex-1",
        "overflow-hidden",
        "inline-block",
        "transition-all duration-300"
      )}
    >
      {/* This grid div is necessary for proper Marquee functionality */}
      <div className="grid grid-cols-[1fr]">
        <Marquee
          speed={35}
          gradient={false}
          pauseOnHover
          play={isPlaying}
          className={cn(
            "overflow-hidden",
            "py-1.5",
            !isPlaying && "opacity-80"
          )}
          autoFill
        >
          <motion.p
            className={cn("whitespace-nowrap", "tracking-wide")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayText}
          </motion.p>
        </Marquee>
      </div>
    </div>
  );
});
