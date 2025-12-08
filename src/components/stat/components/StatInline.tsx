import { cn } from "../../../utils/cn";
import { systemStatThresholds } from "../defaults/thresholds";
import { LabelType } from "../types/labelType";
import { Thresholds } from "../types/thresholds";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface StatProps {
  Icon: React.ReactNode;
  stat: string;
  threshold?: Thresholds;
}

export function StatInline({
  Icon,
  stat,
  threshold = systemStatThresholds,
}: StatProps) {
  const getNumbersFromString = (str: string) => {
    const numbers = str.match(/-?\d+/g)?.map(Number);
    return numbers && numbers.length > 0 ? numbers[0] : NaN;
  };

  const getThresholdLabel = (value: number) => {
    const range = threshold.find((r) => value >= r.min && value <= r.max);
    return range ? range.label : LabelType.DEFAULT;
  };

  const statAsInt = useMemo(() => getNumbersFromString(stat), [stat]);
  const thresholdLabel = useMemo(() => getThresholdLabel(statAsInt), [statAsInt, threshold]);

  const containerClassName = useMemo(() => 
    cn(
      "flex items-center justify-center gap-1.5",
      "transition-colors duration-200",
      thresholdLabel === LabelType.DEFAULT && "text-text",
      thresholdLabel === LabelType.WARNING && "text-warning",
      thresholdLabel === LabelType.DANGER && "text-danger",
      "hover:scale-105"
    ),
    [thresholdLabel]
  );

  return (
    <motion.div
      className={containerClassName}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.5
        }}
      >
        {Icon}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[10px] font-medium"
      >
        {stat}
      </motion.p>
    </motion.div>
  );
}
