import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";
import { smoothAnimations } from "../../../utils/animations";

interface IconButtonProps {
  icon: LucideIcon;
  animateKey?: string;
  animateProps?: any;
  [key: string]: any;
}

// TODO: Shares same animation as Status. Maybe extract to a component?

export const IconButton = ({
  icon: Icon,
  animateKey,
  animateProps,
  ...props
}: IconButtonProps) => {
  const renderInner = (Icon: LucideIcon) => (
    <Icon className="h-3 w-3" strokeWidth={3} />
  );

  return (
    <button
      className={cn(
        "h-full flex items-center justify-center text-icon",
        "hover:text-text",
        "transition-colors duration-300 ease-out"
      )}
      {...props}
    >
      {animateKey ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={animateKey}
            variants={smoothAnimations.scaleInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={smoothAnimations.hoverScale}
            whileTap={smoothAnimations.tapScale}
            {...animateProps}
          >
            {renderInner(Icon)}
          </motion.div>
        </AnimatePresence>
      ) : (
        renderInner(Icon)
      )}
    </button>
  );
};
