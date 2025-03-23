
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ className }) => {
  return (
    <div className={cn("w-full flex flex-col items-center justify-center p-8", className)}>
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-t-2 border-primary/60 animate-spin" style={{ animationDuration: '1.2s' }}></div>
        <div className="absolute inset-4 rounded-full border-t-2 border-primary/40 animate-spin" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-6 text-muted-foreground animate-pulse text-sm">Fetching Pokémon data...</p>
    </div>
  );
};

export default LoadingState;
