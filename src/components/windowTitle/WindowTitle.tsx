import { forwardRef, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppWindowIcon } from "lucide-react";

import { cn } from "../../utils/cn";
import { KomorebiOutput, KomorebiWindow } from "zebar";
import { WindowControls } from "./components/WindowControls";

interface WindowTitleProps {
  komorebi: KomorebiOutput | null;
}

const ANIMATION_EXIT_OFFSET = 3;
const MAX_TITLE_LENGTH = 50;

const getFocusedWindow = (komorebi: KomorebiOutput): KomorebiWindow | null => {
  const { focusedWorkspace } = komorebi;

  if (focusedWorkspace.maximizedWindow) {
    return focusedWorkspace.maximizedWindow;
  }

  if (focusedWorkspace.monocleContainer?.windows?.length) {
    return focusedWorkspace.monocleContainer.windows[0];
  }

  const focusedContainerIndex = focusedWorkspace.focusedContainerIndex;
  if (
    focusedWorkspace.tilingContainers[focusedContainerIndex]?.windows?.length
  ) {
    return focusedWorkspace.tilingContainers[focusedContainerIndex].windows[0];
  }

  if (focusedWorkspace.floatingWindows?.length) {
    return focusedWorkspace.floatingWindows[0];
  }

  return null;
};

export const WindowTitle = forwardRef<HTMLButtonElement, WindowTitleProps>(
  ({ komorebi }, ref) => {
    const [show, setShow] = useState(false);

    const focusedWindow = useMemo(
      () => (komorebi ? getFocusedWindow(komorebi) : null),
      [komorebi]
    );

    if (!komorebi) return null;

    const windowTitle =
      focusedWindow?.title ||
      komorebi.focusedWorkspace.name ||
      "No active window";

    const truncatedTitle =
      windowTitle.length > MAX_TITLE_LENGTH
        ? `${windowTitle.substring(0, MAX_TITLE_LENGTH)}`
        : windowTitle;

    const displayTitle = truncatedTitle || (
      <AppWindowIcon className="h-4 w-4 text-icon" />
    );

    const handleClick = (e: React.MouseEvent) => {
      if (e.altKey) {
        // Handle Alt+Click functionality if needed
      }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.button
          ref={ref}
          key={windowTitle || "default-icon"}
          initial={{ opacity: 0, y: -ANIMATION_EXIT_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: ANIMATION_EXIT_OFFSET }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className={cn(
            "font-medium",
            "relative",
            "h-full",
            "flex",
            "items-center",
            "gap-2",
            "px-2",
            "rounded",
            "hover:bg-hover",
            "transition-colors",
            "min-w-0",
            "max-w-[400px]"
          )}
          title={windowTitle}
          onClick={handleClick}
        >
          <span className="truncate flex-1 min-w-0">{displayTitle}</span>

          <WindowControls
            komorebi={komorebi}
            show={show}
            setShow={setShow}
            parentRef={ref as React.RefObject<HTMLButtonElement>}
          />
        </motion.button>
      </AnimatePresence>
    );
  }
);

WindowTitle.displayName = "WindowTitle";
