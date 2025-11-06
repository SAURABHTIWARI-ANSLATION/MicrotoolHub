import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md mx-auto px-4"
      >
        <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button asChild className="gradient-primary">
          <a href="/" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Return to Parser</span>
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
