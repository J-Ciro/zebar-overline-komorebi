import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

interface SliderProps {
  value: number;
  setValue: (value: number) => void;
}

export default function Slider({ value, setValue }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateValue = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    setValue(Math.round(percentage));
  }, [setValue]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  }, [updateValue]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updateValue]);

  const sliderClassName = useMemo(() => 
    cn(
      "relative w-16 h-1.5 bg-background-deeper/50 rounded-full cursor-pointer overflow-hidden"
    ),
    []
  );

  const progressBarClassName = useMemo(() => 
    cn(
      "absolute top-0 left-0 h-full rounded-full",
      value > 80 ? "bg-danger" : "bg-success/80"
    ),
    [value]
  );

  const thumbClassName = useMemo(() => 
    cn(
      "absolute top-0 h-full w-1.5 rounded-full",
      value > 80 ? "bg-danger" : "bg-success"
    ),
    [value]
  );

  return (
    <div
      ref={sliderRef}
      className={sliderClassName}
      onMouseDown={handleMouseDown}
    >
      <motion.div
        className={progressBarClassName}
        initial={{ width: `${value}%` }}
        animate={{ width: `${value}%` }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.5
        }}
      />
      <motion.div
        className={thumbClassName}
        style={{ left: `calc(${value}% - 3px)` }}
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.5
        }}
      />
    </div>
  );
}
