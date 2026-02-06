import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeWheelPickerProps {
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
}

const ITEM_HEIGHT = 44;

const WheelColumn = ({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      containerRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
    }
  }, [selectedIndex, isScrolling]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      
      containerRef.current.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });
      
      onSelect(clampedIndex);
      setIsScrolling(false);
    }, 100);
  };

  return (
    <div className="relative h-[220px] overflow-hidden flex-1">
      {/* Selection highlight */}
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[44px] bg-primary/10 rounded-xl pointer-events-none z-0" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{
          paddingTop: `${ITEM_HEIGHT * 2}px`,
          paddingBottom: `${ITEM_HEIGHT * 2}px`,
          scrollSnapType: "y mandatory",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "h-[44px] flex items-center justify-center transition-all cursor-pointer",
              "scroll-snap-align-center",
              selectedIndex === index
                ? "text-foreground text-2xl font-semibold"
                : "text-muted-foreground/40 text-xl"
            )}
            style={{ scrollSnapAlign: "center" }}
            onClick={() => {
              onSelect(index);
              containerRef.current?.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: "smooth",
              });
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TimeWheelPicker = ({ value, onChange }: TimeWheelPickerProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const formatTime = () => {
    return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm font-medium text-muted-foreground">Select time</span>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {formatTime()}
        </span>
      </div>

      {/* Wheel picker */}
      <div className="flex items-center justify-center bg-muted/30 rounded-2xl overflow-hidden">
        <WheelColumn
          items={hours}
          selectedIndex={value.hour}
          onSelect={(index) => onChange({ ...value, hour: index })}
        />
        <div className="text-2xl font-semibold text-foreground">:</div>
        <WheelColumn
          items={minutes}
          selectedIndex={value.minute}
          onSelect={(index) => onChange({ ...value, minute: index })}
        />
      </div>
    </div>
  );
};
