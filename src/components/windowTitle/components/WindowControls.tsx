"use client";

import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { KomorebiOutput } from "zebar";
import { shellExec } from "zebar";
import { buttonVariants, menuVariants, smoothAnimations } from "../../../utils/animations";

interface WindowControlsProps {
  komorebi: KomorebiOutput;
  show: boolean;
  setShow: (show: boolean) => void;
  parentRef: React.RefObject<HTMLButtonElement>;
}

export function WindowControls({
  komorebi,
  show,
  setShow,
  parentRef,
}: WindowControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShow, parentRef]);

  const handleClose = async () => {
    try {
      await shellExec("komorebic", ["close-window"]);
      setShow(false);
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  };

  const handleMaximize = async () => {
    try {
      await shellExec("komorebic", ["toggle-maximize"]);
      setShow(false);
    } catch (error) {
      console.error("Failed to maximize window:", error);
    }
  };

  const handleMinimize = async () => {
    try {
      await shellExec("komorebic", ["minimize-window"]);
      setShow(false);
    } catch (error) {
      console.error("Failed to minimize window:", error);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={controlsRef}
          className="absolute top-full mt-1 right-0 z-50 bg-background-subtle/90 backdrop-blur-md border border-border rounded-md shadow-lg overflow-hidden"
          variants={menuVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={menuVariants.transition}
        >
          <div className="flex flex-col divide-y divide-border/20">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              transition={{ ...buttonVariants.transition, delay: 0.05 }}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-background-deeper transition-colors duration-200 text-sm"
              onClick={handleMaximize}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={smoothAnimations.smoothRotate}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </motion.div>
              <span>Maximize</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              transition={{ ...buttonVariants.transition, delay: 0.1 }}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-background-deeper transition-colors duration-200 text-sm"
              onClick={handleMinimize}
            >
              <motion.div
                whileHover={{ y: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </motion.div>
              <span>Minimize</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              transition={{ ...buttonVariants.transition, delay: 0.15 }}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors duration-200 text-sm"
              onClick={handleClose}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={smoothAnimations.smoothRotate}
              >
                <X className="h-3.5 w-3.5" />
              </motion.div>
              <span>Close</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
