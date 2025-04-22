
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-edu-secondary mb-2">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-edu-primary hover:bg-edu-secondary"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
