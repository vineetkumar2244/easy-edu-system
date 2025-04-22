
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleNavigateToDashboard = () => {
    if (user?.role === "teacher") {
      navigate("/teacher");
    } else if (user?.role === "student") {
      navigate("/student");
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 
            className="font-bold text-2xl text-edu-primary cursor-pointer" 
            onClick={() => navigate("/")}
          >
            EasyEdu
          </h1>
          {user?.role && (
            <span className="bg-edu-light text-edu-secondary text-xs font-medium px-2 py-1 rounded-full capitalize">
              {user.role}
            </span>
          )}
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center mr-2">
              <span className="font-medium text-sm mr-1">
                {user?.name}
              </span>
              {user?.role === "student" && user?.class && (
                <span className="bg-edu-light text-edu-secondary text-xs px-2 py-0.5 rounded-full">
                  {user.class} Grade
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavigateToDashboard}
              className="text-edu-gray hover:text-edu-primary hover:bg-edu-light"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-edu-gray hover:text-edu-danger hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
