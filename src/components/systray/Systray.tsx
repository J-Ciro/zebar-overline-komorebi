import { useState } from "react";
import { SystrayOutput } from "zebar";
import { ExpandingCarousel } from "./components/ExpandingCarousel";
import { SystrayItem } from "./components/SystrayItem";

type SystrayProps = {
  systray: SystrayOutput | null;
}

export function Systray({ systray }: SystrayProps) {
  if (!systray) return;
  const icons = systray.icons;
  const [expanded, setExpanded] = useState(false);
  const ICON_CUTOFF = 4;

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  }

  // Filter out specific icons by their IDs
  const filteredIcons = icons.filter(icon => {
    const excludedIds = [
      "6da68f06-00f1-4e6e-8158-7f1ffd4f9db9",
      "7820ae73-23e3-4229-82c1-e41cb67d5b9c"
    ];
    return !excludedIds.includes(icon.id);
  });

  const systrayIcons = filteredIcons.map((item) => <SystrayItem key={item.id} systray={systray} icon={item} />);

  return (
    <div 
      className="flex items-center gap-1.5" 
      onClick={handleClick}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        perspective: '1000px',
        willChange: 'transform'
      }}
    >
      <ExpandingCarousel 
        items={systrayIcons} 
        expanded={expanded} 
        gap={6} 
        itemWidth={16} 
        visibleCount={ICON_CUTOFF} 
      />
    </div>
  )
}

