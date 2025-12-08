import { SystrayIcon, SystrayOutput } from "zebar";
import { motion } from "framer-motion";

const buttonType = {
  "LEFT": 0,
  "MIDDLE": 1,
  "RIGHT": 2,
}

interface SystrayItemProps {
  icon: SystrayIcon;
  systray: SystrayOutput;
}

export function SystrayItem({ icon, systray }: SystrayItemProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) return;
    switch (e.button) {
      case buttonType["LEFT"]:
        systray.onLeftClick(icon.id);
        break;
      case buttonType["MIDDLE"]:
        systray.onMiddleClick(icon.id);
        break;
      case buttonType["RIGHT"]:
        systray.onRightClick(icon.id);
        break;
    }
  }

  return (
    <motion.button
      className="h-4 w-4 flex items-center justify-center"
      onMouseDown={(e) => handleClick(e)}
      onContextMenu={(e) => { e.preventDefault() }}
      onMouseEnter={() => systray.onHoverEnter(icon.id)}
      onMouseMove={() => systray.onHoverMove(icon.id)}
      onMouseLeave={() => systray.onHoverLeave(icon.id)}
      title={icon.tooltip}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        perspective: '1000px',
        willChange: 'transform',
        imageRendering: 'crisp-edges'
      }}
      whileHover={{ 
        scale: 1.1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
    >
      <motion.img
        src={icon.iconUrl}
        className="h-4 w-4 select-none filter grayscale"
        style={{
          imageRendering: 'crisp-edges',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        whileHover={{ 
          filter: "grayscale(0%)",
          transition: {
            duration: 0.2,
            ease: "easeInOut"
          }
        }}
        alt=""
      />
    </motion.button>
  )
}
