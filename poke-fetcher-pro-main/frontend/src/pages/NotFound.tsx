
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="text-center glass p-8 rounded-xl shadow-sm max-w-md w-full animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Button 
          asChild
          className="flex items-center gap-2"
        >
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
