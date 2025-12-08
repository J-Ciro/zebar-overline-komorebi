import { motion, AnimatePresence } from "framer-motion";
import { KomorebiOutput } from "zebar";
import useMeasure from "react-use-measure";
import { cn } from "../utils/cn";
import { Chip } from "./common/Chip";
import { shellExec } from "zebar";
import { useMemo } from "react";

interface WorkspaceControlsProps {
  komorebi: KomorebiOutput | null;
}

export function WorkspaceControls({ komorebi }: WorkspaceControlsProps) {
  if (!komorebi?.currentMonitor) return null;

  const [ref, { width }] = useMeasure();
  const workspaces = komorebi.currentMonitor.workspaces || [];
  const focusedIndex = komorebi.currentMonitor.focusedWorkspaceIndex ?? 0;
  const focusedWorkspace = workspaces[focusedIndex];

  const isWorkspaceActive = (ws: any): boolean => {
    if (!ws) return false;
    if (ws.maximizedWindow) return true;
    if (ws.monocleContainer?.windows?.length > 0) return true;
    if (ws.floatingWindows?.length > 0) return true;
    if (Array.isArray(ws.tilingContainers)) {
      return ws.tilingContainers.some((container: any) => container?.windows?.length > 0);
    }
    return false;
  };

  const indicesToShow = useMemo(() => {
    return workspaces
      .map((ws, idx) => (isWorkspaceActive(ws) || idx === focusedIndex ? idx : null))
      .filter((idx) => idx !== null) as number[];
  }, [workspaces, focusedIndex]);

  const springConfig = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  };

  const handleWheel = (e: React.WheelEvent<HTMLButtonElement>) => {
    const delta = e.deltaY > 0 ? 1 : -1;
    const workspaceIndex = workspaces.findIndex(w => w.name === focusedWorkspace?.name);
    const newWorkspace = workspaces[workspaceIndex + delta];
    // Navegación por scroll (implementación futura si se desea)
  };

  const handleWorkspaceClick = async (workspaceName: string) => {
    try {
      await shellExec("komorebic", ["focus", "--workspace", workspaceName]);
    } catch (error) {
      console.error("Error switching workspace:", error);
    }
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: width || "auto", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={springConfig}
      className="relative overflow-hidden h-full"
    >
      <Chip
        className={cn(
          width ? "absolute" : "relative",
          "flex items-center gap-1.5 select-none overflow-hidden px-[2px] h-full"
        )}
        as="div"
        ref={ref}
        onWheel={handleWheel}
      >
        {indicesToShow.map((realIdx) => {
          const workspace = workspaces[realIdx];
          const isFocused = realIdx === focusedIndex;
          const displayName = workspace.name || `${realIdx + 1}`;
          return (
            <button
              key={`${workspace.name || realIdx}-${realIdx}`}
              onClick={() => handleWorkspaceClick(workspace.name ?? "")}
              className={cn(
                "relative rounded-xl px-2 transition duration-500 ease-in-out h-full",
                isFocused ? "text-text font-medium duration-700 transition-all ease-in-out" : "text-text-muted hover:text-text",
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <p className={cn("z-10")}>{displayName}</p>
              <AnimatePresence mode="wait">
                {isFocused && (
                  <motion.span
                    key={`bubble-${workspace.name || realIdx}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "bg-primary border-primary-border drop-shadow-sm rounded-[0.5rem] absolute inset-0 -z-10"
                    )}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 25, 
                      mass: 1.1,
                      duration: 0.4
                    }}
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </Chip>
    </motion.div>
  );
}
