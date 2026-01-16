import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import { debounce } from "../../../utils/performance";
import { useAnimation } from "../../../utils/useAnimation";

interface SliderProps {
  value: number;
  setValue: (value: number) => void;
}

export function Slider({ value, setValue }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Debounced update to reduce rapid volume changes during drag
  const debouncedSetValue = useMemo(
    () => debounce((value: number) => setValue(value), 50) as (value: number) => void,
    [setValue]
  );

  const updateValue = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    const roundedValue = Math.round(percentage);
    
    // During dragging, use debounced updates for smoother performance
    if (isDragging) {
      debouncedSetValue(roundedValue);
    } else {
      setValue(roundedValue);
    }
  }, [setValue, debouncedSetValue, isDragging]);

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
        {...useAnimation().createWidthAnimation(value, useAnimation().springConfigs.medium)}
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
