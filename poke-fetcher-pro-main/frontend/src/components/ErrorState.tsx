
import React from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, className }) => {
  return (
    <div className={cn("w-full rounded-lg p-4 animate-slide-up", className)}>
      <div className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry} 
            className="mt-2 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
