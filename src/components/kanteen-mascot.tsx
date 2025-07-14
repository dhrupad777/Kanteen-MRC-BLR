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
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)" />
        </filter>
      </defs>
      
      <g filter="url(#shadow)">
        {/* Lid Handle */}
        <path
          d="M45 28 C45 23, 55 23, 55 28 L 55 32 L 45 32 Z"
          className={cn(
            "stroke-slate-600 stroke-2 transition-colors duration-300",
            isPreparing && "fill-blue-600",
            isReady && "fill-green-600",
            state === "default" && "fill-slate-500"
          )}
        />
        {/* Lid */}
        <path
          d="M20 50 C 20 30, 80 30, 80 50 Z"
          className={cn(
            "stroke-slate-500 stroke-[3] transition-colors duration-300",
             isPreparing && "fill-blue-500",
            isReady && "fill-green-500",
            state === "default" && "fill-slate-400"
          )}
        />
        
        {/* Body */}
        <path
          d="M20 50 H 80 V 90 C 80 95, 75 95, 70 95 H 30 C 25 95, 20 95, 20 90 Z"
          className={cn(
            "stroke-slate-500 stroke-[3] transition-colors duration-300",
            isPreparing && "fill-blue-200",
            isReady && "fill-green-200",
            state === "default" && "fill-slate-200"
          )}
        />
        
        {/* Shirt */}
         <path
          d="M22 55 H 78 V 75 H 22 Z"
          className={cn(
            "transition-colors duration-300",
            isPreparing && "fill-blue-400",
            isReady && "fill-green-400",
            state === "default" && "fill-orange-400"
          )}
        />
        <path
          d="M30 55 V 75"
           className={cn(
            "transition-colors duration-300 stroke-black/20 stroke-2",
          )}
        />
         <path
          d="M70 55 V 75"
           className={cn(
            "transition-colors duration-300 stroke-black/20 stroke-2",
          )}
        />


        {/* Face */}
        <g className="transition-transform duration-300">
          {/* Eyes */}
          <circle cx="40" cy="65" r="4" fill="white" stroke="black" strokeWidth="1.5"/>
          <circle cx="39" cy="64" r="1.5" fill="black" />
          <circle cx="60" cy="65" r="4" fill="white" stroke="black" strokeWidth="1.5"/>
          <circle cx="59" cy="64" r="1.5" fill="black" />
          
          {/* Mouth */}
          <path
            d={isReady ? "M45 75 Q50 82, 55 75" : "M45 75 Q50 72, 55 75"}
            stroke="black"
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />
        </g>

        {/* Arms and Props */}
        {isPreparing && (
           <g className="transition-opacity duration-300 opacity-100 arm-group">
            {/* Left Arm */}
            <path d="M22 65 C 10 60, 10 75, 22 70"  
              className={cn("stroke-[3] transition-colors duration-300", isPreparing && "stroke-blue-500")}
              fill={cn(isPreparing && "fill-blue-200")} 
            />
            {/* Right Arm with Clock */}
            <path d="M78 65 C 95 60, 95 40, 78 45"
              className={cn("stroke-[3] transition-colors duration-300", isPreparing && "stroke-blue-500")}
              fill={cn(isPreparing && "fill-blue-200")} 
             />
            <circle cx="88" cy="35" r="8" fill="white" stroke="black" strokeWidth="1.5" />
            <line x1="88" y1="35" x2="88" y2="30" stroke="black" strokeWidth="1" />
            <line x1="88" y1="35" x2="92" y2="37" stroke="black" strokeWidth="1" />
          </g>
        )}
        {isReady && (
            <g className="transition-opacity duration-300 opacity-100 arm-group">
              {/* Left Arm */}
              <path d="M22 65 C 10 55, 15 85, 22 75"
                className={cn("stroke-[3] transition-colors duration-300", isReady && "stroke-green-500")}
                fill={cn(isReady && "fill-green-200")} 
              />
              {/* Right Arm */}
              <path d="M78 65 C 90 55, 85 85, 78 75"
                className={cn("stroke-[3] transition-colors duration-300", isReady && "stroke-green-500")}
                fill={cn(isReady && "fill-green-200")} 
              />
            </g>
        )}
      </g>
    </svg>
  );
};
