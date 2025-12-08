import type React from "react";
import { ChevronRight, Search, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "./common/Button";
import { cn } from "../utils/cn";
import type { KomorebiOutput } from "zebar";
import { shellExec } from "zebar";
import { smoothAnimations } from "../utils/animations";

interface TilingControlProps {
  komorebi?: KomorebiOutput | null;
}

// Mapeo para mostrar los nombres (usa los valores de la API)
const LAYOUT_DISPLAY_NAMES: Record<string, string> = {
  bsp: "BSP",
  vertical_stack: "V-Stack",
  horizontal_stack: "H-Stack",
  ultrawide_vertical_stack: "Ultrawide",
  rows: "Rows",
  grid: "Grid",
  right_main_vertical_stack: "R-Main",
  custom: "Custom",
} as const;

// Mapeo para traducir a los valores que acepta el CLI
const LAYOUT_TO_CLI: Record<string, string> = {
  bsp: "bsp",
  vertical_stack: "vertical-stack",
  horizontal_stack: "horizontal-stack",
  ultrawide_vertical_stack: "ultrawide-vertical-stack",
  rows: "rows",
  grid: "grid",
  right_main_vertical_stack: "right-main-vertical-stack",
  custom: "custom",
};

// Función para obtener el nombre para mostrar
const getDisplayName = (layoutKey: string): string => {
  return LAYOUT_DISPLAY_NAMES[layoutKey] || "Custom";
};

// Función para traducir al formato del CLI
const toCliFormat = (layoutKey: string): string => {
  return LAYOUT_TO_CLI[layoutKey] || "bsp";
};

export function TilingControl({ komorebi }: TilingControlProps = {}) {
  const [expanded, setExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const currentLayoutKey = komorebi?.focusedWorkspace?.layout ?? "bsp";
  const currentLayoutName = getDisplayName(currentLayoutKey);

  // Preparamos los layouts disponibles para mostrar
  const availableLayouts = Object.keys(LAYOUT_DISPLAY_NAMES)
    .filter((key) => key !== currentLayoutKey)
    .map((key) => ({
      cliKey: toCliFormat(key),
      displayKey: key,
      displayName: getDisplayName(key),
    }));

  const executeKomorebiCommand = async (
    command: string,
    args: string[] = []
  ) => {
    setIsProcessing(true);
    setLastError(null);
    try {
      const result = await shellExec("komorebic", [command, ...args]);
      if (result.code !== 0) {
        throw new Error(
          result.stderr || `Command failed with code ${result.code}`
        );
      }
      return result;
    } catch (error) {
      console.error(`Error executing: komorebic ${command}`, error);
      setLastError(`Failed to execute: ${command}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLayoutChange = async (displayKey: string) => {
    try {
      // Convertimos a formato CLI justo antes de enviar el comando
      const cliKey = toCliFormat(displayKey);
      await executeKomorebiCommand("change-layout", [cliKey]);
      setExpanded(false);
    } catch (error) {
      console.error("Failed to change layout:", error);
    }
  };

  const handleFlipLayout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const currentFlip = komorebi?.focusedWorkspace?.layoutFlip;
      const direction = !currentFlip
        ? "horizontal"
        : currentFlip === "horizontal"
        ? "vertical"
        : "horizontal";
      await executeKomorebiCommand("flip-layout", [direction]);
    } catch (error) {
      console.error("Failed to flip layout:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleLaunchFlowLauncher = async () => {
  //   try {
  //     await shellExec("flow-launcher.exe");
  //   } catch (error) {
  //     console.error("Failed to launch Flow Launcher:", error);
  //     setLastError("Failed to launch Flow Launcher");
  //   }
  // };

  const getFlipIcon = () => {
    const flip = komorebi?.focusedWorkspace?.layoutFlip;
    return (
      <motion.div
        animate={{
          rotate: flip === "horizontal" ? 0 : 90
        }}
        transition={smoothAnimations.smoothRotate}
      >
        <ChevronRight
          className={cn(
            "h-3 w-3",
            flip === "horizontal" ? "text-icon" : "text-icon/70"
          )}
          strokeWidth={3}
        />
      </motion.div>
    );
  };

  return (
    <div className="flex items-center h-full overflow-hidden gap-1 pl-2">
      <Button
        onClick={() => setExpanded(!expanded)}
        className="h-full px-2 hover:bg-background transition-colors duration-300 shrink-0 relative flex items-center gap-1"
        disabled={isProcessing}
      >
        <LayoutGrid className="h-3 w-3" strokeWidth={3} />
        <span className="text-xxs font-medium">{currentLayoutName}</span>
        {isProcessing && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
        )}
        {lastError && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      <Button
        onClick={handleFlipLayout}
        className="h-full px-1 hover:bg-background transition-colors duration-300 relative group"
        title="Flip layout orientation"
        disabled={isProcessing}
      >
        {getFlipIcon()}
        <motion.span
          variants={smoothAnimations.fadeInOut}
          initial="initial"
          animate="animate"
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/90 text-xxs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg"
        >
          {komorebi?.focusedWorkspace?.layoutFlip === "horizontal" ? "Horizontal" : "Vertical"}
        </motion.span>
      </Button>

      {/* <Button
        onClick={handleLaunchFlowLauncher}
        className="h-full px-1 hover:bg-background transition-colors duration-300"
        title="Open Flow Launcher"
        disabled={isProcessing}
      >
        <Search className="h-3 w-3" strokeWidth={3} />
      </Button> */}

      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              duration: 0.4,
              ease: smoothAnimations.easeOut,
            }}
            className="relative h-full flex"
          >
            <motion.div
              className="h-full bg-background border-l border-border/50 flex"
              variants={smoothAnimations.slideInOut}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {availableLayouts.map(({ displayKey, displayName }, index) => (
                <motion.div
                  key={displayKey}
                  variants={smoothAnimations.scaleInOut}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    ...smoothAnimations.scaleInOut.transition,
                    delay: index * 0.02,
                  }}
                >
                  <Button
                    onClick={() => handleLayoutChange(displayKey)}
                    className="h-full px-2 rounded-none hover:bg-background/50 text-xxs font-normal flex items-center justify-center transition-colors duration-200 min-w-[4rem]"
                  >
                    <span className="whitespace-nowrap">{displayName}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
