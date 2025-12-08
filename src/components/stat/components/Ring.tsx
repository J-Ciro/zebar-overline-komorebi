import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";

interface RingProps {
  percentage: number;
  className?: string;
  strokeColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
}

const Ring = ({
  percentage,
  className,
  strokeColor = "stroke-green-500",
  backgroundColor = "stroke-background",
  strokeWidth = 14,
}: RingProps) => {
  const size = 100;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      className="relative flex items-center justify-center rounded-full overflow-hidden"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5
      }}
    >
      <svg
        className={cn(
          className,
          "transition-transform duration-200",
          "hover:scale-110"
        )}
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        {/* Border Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius + strokeWidth / 2}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-background-deeper/50"
        />
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={cn(
            backgroundColor,
            "transition-colors duration-200"
          )}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Circle (Progress Circle) */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className={cn(
            strokeColor,
            "transition-colors duration-200"
          )}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
            mass: 0.5
          }}
        />
      </svg>
    </motion.div>
  );
};

export default Ring;
