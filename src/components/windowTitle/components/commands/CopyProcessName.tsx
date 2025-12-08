import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { GlazeWmOutput, KomorebiOutput } from "zebar";
import { IconButton } from "../IconButton";
import { CommandProps } from "./types/command";

const getWindowProcess = (komorebi: KomorebiOutput | null): string | null => {
  if (!komorebi) return null;
  const ws = komorebi.focusedWorkspace;
  // Prioridad: maximizedWindow, monocleContainer, floatingWindows, tilingContainers
  if (ws.maximizedWindow && ws.maximizedWindow.exe) return ws.maximizedWindow.exe;
  if (ws.monocleContainer && ws.monocleContainer.windows && ws.monocleContainer.windows.length > 0) {
    const win = ws.monocleContainer.windows[0];
    if (win.exe) return win.exe;
  }
  if (ws.floatingWindows && ws.floatingWindows.length > 0) {
    const win = ws.floatingWindows[0];
    if (win.exe) return win.exe;
  }
  if (ws.tilingContainers && ws.tilingContainers.length > 0) {
    const win = ws.tilingContainers[0].windows[0];
    if (win && win.exe) return win.exe;
  }
  return null;
};

export const CopyProcessName = ({ komorebi }: CommandProps) => {
  const tooltipText = "Copy process name of the window";
  const [copying, setCopying] = useState(false);

  const handleCopyProcessName = () => {
    const processName = getWindowProcess(komorebi);
    if (processName) {
      navigator.clipboard
        .writeText(processName)
        .then(() => {
          console.log(`Copied to clipboard: ${processName}`);
          setCopying(true);
          setTimeout(() => setCopying(false), 750);
        })
        .catch((err) => {
          console.error("Failed to copy text to clipboard:", err);
        });
    }
  };

  return (
    <IconButton
      animateKey={copying ? "copying" : "not-copying"}
      title={tooltipText}
      onClick={handleCopyProcessName}
      icon={copying ? Check : Clipboard}
    />
  );
};
