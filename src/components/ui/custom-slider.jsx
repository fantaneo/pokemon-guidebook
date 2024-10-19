import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const CustomSlider = React.forwardRef(({ className, ...props }, ref) => {
  const handleTickClick = (value) => {
    if (props.onValueChange) {
      props.onValueChange([value]);
    }
  };

  const tickValues = [0, 25, 50, 75, 100, 125, 150];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-blue-100">
        <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />

      {/* 目盛りを追加 */}
      <div className="absolute top-6 left-0 right-0 flex justify-between px-1">
        {tickValues.map((value) => (
          <div
            key={value}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleTickClick(value)}
          >
            <div className="h-2 w-0.5 bg-blue-200" />
            <span className="text-xs text-blue-600 mt-1">{value}</span>
          </div>
        ))}
      </div>
    </SliderPrimitive.Root>
  );
});

CustomSlider.displayName = SliderPrimitive.Root.displayName;

export { CustomSlider };
