import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimeWheelPickerProps {
  value: { hour: number; minute: number; period: "AM" | "PM" };
  onChange: (value: { hour: number; minute: number; period: "AM" | "PM" }) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

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
    <div className="relative h-[200px] overflow-hidden">
      {/* Selection highlight */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[40px] bg-muted/60 rounded-lg pointer-events-none z-0" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide scroll-smooth"
        onScroll={handleScroll}
        style={{
          paddingTop: `${ITEM_HEIGHT * 2}px`,
          paddingBottom: `${ITEM_HEIGHT * 2}px`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "h-[40px] flex items-center justify-center text-lg font-medium transition-all",
              selectedIndex === index
                ? "text-foreground scale-110"
                : "text-muted-foreground/50"
            )}
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
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const periods = ["AM", "PM"];

  const hourIndex = value.hour === 12 ? 11 : value.hour - 1;
  const minuteIndex = value.minute;
  const periodIndex = value.period === "AM" ? 0 : 1;

  const formatTime = () => {
    return `${value.hour}:${String(value.minute).padStart(2, "0")} ${value.period}`;
  };

  return (
    <div className="w-full">
      {/* Header with time display */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-medium text-foreground">Time</span>
        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
          {formatTime()}
        </span>
      </div>

      {/* Wheel picker */}
      <div className="flex items-center justify-center gap-0 bg-card rounded-2xl py-2">
        <div className="w-20">
          <WheelColumn
            items={hours}
            selectedIndex={hourIndex}
            onSelect={(index) =>
              onChange({ ...value, hour: index + 1 })
            }
          />
        </div>
        <div className="w-20">
          <WheelColumn
            items={minutes}
            selectedIndex={minuteIndex}
            onSelect={(index) =>
              onChange({ ...value, minute: index })
            }
          />
        </div>
        <div className="w-16">
          <WheelColumn
            items={periods}
            selectedIndex={periodIndex}
            onSelect={(index) =>
              onChange({ ...value, period: index === 0 ? "AM" : "PM" })
            }
          />
        </div>
      </div>
    </div>
  );
};
