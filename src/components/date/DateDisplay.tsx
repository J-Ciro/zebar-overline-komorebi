import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { useAnimation } from "../../utils/useAnimation";

interface DateDisplayProps {
  formattedDate: string;
}

export const DateDisplay = React.memo(function DateDisplay({ formattedDate }: DateDisplayProps) {
  const [weekday, day, month, time] = useMemo(() => {
    return formattedDate.split(" ");
  }, [formattedDate]);

  const containerClassName = useMemo(
    () =>
      cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md",
        "bg-background-deeper backdrop-blur-sm",
        "border border-app-border/10",
        "transition-all duration-300 ease-in-out",
        "hover:bg-background-deeper/30 hover:border-app-border/20"
      ),
    []
  );

  const { getAnimationProps, createDelayedAnimation } = useAnimation();

  return (
    <motion.div
      className={containerClassName}
      {...getAnimationProps('slideUp', 'smooth')}
    >
      <motion.div
        className="flex items-center gap-1"
        {...createDelayedAnimation('slideRight', 0.1, 'quick')}
      >
        <span className="text-text/75 text-[11px] font-medium">{weekday}</span>
        <span className="text-text/75 text-[11px] font-medium">{day}</span>
        <span className="text-text/75 text-[11px] font-medium">{month}</span>
      </motion.div>

      <motion.div
        className="flex items-center"
        {...createDelayedAnimation('slideLeft', 0.2, 'quick')}
      >
        <span className="text-text/75 text-[11px] font-medium ml-1">
          {time}
        </span>
      </motion.div>
    </motion.div>
  );
});
