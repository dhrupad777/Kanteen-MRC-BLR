import { cn } from "@/lib/utils";
import React from "react";

interface KanteenMascotProps extends React.SVGProps<SVGSVGElement> {
  state?: "default" | "preparing" | "ready";
}

export const KanteenMascot = ({ state = "default", className, ...props }: KanteenMascotProps) => {
  const isPreparing = state === "preparing";
  const isReady = state === "ready";
  const isDefault = state === "default";

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
          d="M20 90 C20 70, 80 70, 80 90 V 95 H 20 Z"
          className={cn(
            "stroke-slate-500 stroke-[3] transition-colors duration-300",
            isPreparing && "fill-blue-400",
            isReady && "fill-green-400",
            isDefault && "fill-slate-200"
          )}
        />
        
        {/* Lid */}
        <path
          d="M25 70 Q50 60, 75 70"
          className={cn(
            "stroke-slate-500 stroke-[3] transition-colors duration-300",
            isPreparing && "fill-blue-500",
            isReady && "fill-green-500",
            isDefault && "fill-slate-400"
          )}
        />
        <path
          d="M45 62 Q50 58, 55 62"
          className={cn(
            "stroke-slate-600 stroke-2 transition-colors duration-300",
            isPreparing && "fill-blue-600",
            isReady && "fill-green-600",
            isDefault && "fill-slate-500"
          )}
          
        />

        {/* Face */}
        <g className="transition-transform duration-300">
          <circle cx="40" cy="80" r="3" fill="black" />
          <circle cx="60" cy="80" r="3" fill="black" />
          <path
            d={isReady ? "M45 87 Q50 92, 55 87" : "M45 87 L55 87"}
            stroke="black"
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />
        </g>

        {/* Arms */}
        {isPreparing && (
          <g className="transition-opacity duration-300 opacity-100">
            {/* Clock */}
            <circle cx="75" cy="50" r="10" fill="white" stroke="black" strokeWidth="1.5" />
            <line x1="75" y1="50" x2="75" y2="44" stroke="black" strokeWidth="1" />
            <line x1="75" y1="50" x2="80" y2="52" stroke="black" strokeWidth="1" />
            {/* Arm holding clock */}
            <path d="M78 85 C85 80, 85 65, 78 60" stroke="black" strokeWidth="2" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
};
