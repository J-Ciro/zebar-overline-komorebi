import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "../../utils/cn";

interface DateDisplayProps {
  formattedDate: string;
}

export function DateDisplay({ formattedDate }: DateDisplayProps) {
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

  return (
    <motion.div
      className={containerClassName}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      }}
    >
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-text/75 text-[11px] font-medium">{weekday}</span>
        <span className="text-text/75 text-[11px] font-medium">{day}</span>
        <span className="text-text/75 text-[11px] font-medium">{month}</span>
      </motion.div>

      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-text/75 text-[11px] font-medium ml-1">
          {time}
        </span>
      </motion.div>
    </motion.div>
  );
}
