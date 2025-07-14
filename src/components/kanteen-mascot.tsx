import { cn } from "@/lib/utils";
import React from "react";

interface KanteenMascotProps extends React.SVGProps<SVGSVGElement> {
  state?: "default" | "preparing" | "ready";
}

export const KanteenMascot = ({ state = "default", className, ...props }: KanteenMascotProps) => {
  const isPreparing = state === "preparing";
  const isReady = state === "ready";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("transition-all duration-300", className)}
      {...props}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.15)" />
        </filter>
      </defs>
      
      <g filter="url(#shadow)">
        {/* Body */}
        <path 
          d="M30 95 C 25 70, 25 50, 35 45 L 65 45 C 75 50, 75 70, 70 95 Z"
          className={cn(
            "stroke-black/50 stroke-2",
            isPreparing && "fill-blue-200",
            isReady && "fill-green-200",
            state === "default" && "fill-slate-100"
          )}
        />
        {/* Apron */}
         <path 
          d="M40 55 H 60 V 80 H 40 Z"
          className={cn(
            "stroke-black/50 stroke-1",
            isPreparing && "fill-blue-400",
            isReady && "fill-green-400",
            state === "default" && "fill-orange-400"
          )}
        />

        {/* Head */}
        <circle cx="50" cy="35" r="18" fill="#FDEBD0" stroke="#000" strokeWidth="1.5" />
        
        {/* Chef Hat */}
        <path d="M30 25 H 70 V 20 H 30 Z" fill="white" stroke="black" strokeWidth="1.5"/>
        <path d="M30 20 Q 20 10, 40 10 C 50 5, 60 5, 70 10 Q 80 10, 70 20 Z" fill="white" stroke="black" strokeWidth="1.5"/>
        
        {/* Face */}
        <g>
          {/* Eyes */}
          <circle cx="42" cy="35" r="2.5" fill="white" stroke="black" strokeWidth="1"/>
          <circle cx="41.5" cy="34.5" r="1" fill="black" />
          <circle cx="58" cy="35" r="2.5" fill="white" stroke="black" strokeWidth="1"/>
          <circle cx="57.5" cy="34.5" r="1" fill="black" />
          
          {/* Mouth */}
          <path
            d={isReady ? "M45 45 Q50 50, 55 45" : "M45 45 Q50 43, 55 45"}
            stroke="black"
            strokeWidth="1.5"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Mustache */}
          <path d="M40 42 C 45 38, 55 38, 60 42 C 55 42, 45 42, 40 42 Z" fill="#6D4C41" stroke="black" strokeWidth="1"/>
        </g>
        
        {/* Arms and Props */}
        {isPreparing && (
           <g className="transition-opacity duration-300 opacity-100 arm-group">
            {/* Left Arm */}
            <path d="M35 60 C 20 55, 15 75, 30 70" fill="#FDEBD0" stroke="black" strokeWidth="1.5" />
            {/* Right Arm with Clock */}
            <path d="M65 60 C 85 55, 90 30, 75 40" fill="#FDEBD0" stroke="black" strokeWidth="1.5" />
            <circle cx="85" cy="28" r="8" fill="white" stroke="black" strokeWidth="1.5" />
            <line x1="85" y1="28" x2="85" y2="23" stroke="black" strokeWidth="1" />
            <line x1="85" y1="28" x2="89" y2="30" stroke="black" strokeWidth="1" />
          </g>
        )}
        {isReady && (
            <g className="transition-opacity duration-300 opacity-100 arm-group">
              {/* Left Arm Thumbs Up */}
               <path d="M35 60 C 25 55, 20 70, 30 70 L 28 65 L 25 67 L 25 75 L 35 75 C 40 75, 40 70, 35 70" fill="#FDEBD0" stroke="black" strokeWidth="1.5"/>
              {/* Right Arm */}
              <path d="M65 60 C 75 55, 80 75, 70 70" fill="#FDEBD0" stroke="black" strokeWidth="1.5"/>
            </g>
        )}
      </g>
    </svg>
  );
};
