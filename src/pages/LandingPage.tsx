
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-edu-light to-white flex flex-col">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-bold text-edu-primary">EasyEdu</h1>
        </div>
        
        {!selectedRole ? (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-edu-secondary mb-4">
              Simplified Learning Management System
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A streamlined platform for teachers to upload lessons and create quizzes,
              and for students to access learning materials and test their knowledge.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
                <div className="w-20 h-20 bg-edu-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-edu-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">For Teachers</h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Upload lessons, create quizzes, and track student progress all in one place.
                </p>
                <Button 
                  className="mt-auto bg-edu-primary hover:bg-edu-secondary"
                  onClick={() => setSelectedRole("teacher")}
                >
                  Login / Sign Up as Teacher
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
                <div className="w-20 h-20 bg-edu-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-edu-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">For Students</h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Access class materials, watch video lessons, and take quizzes to test your knowledge.
                </p>
                <Button 
                  className="mt-auto bg-edu-primary hover:bg-edu-secondary"
                  onClick={() => setSelectedRole("student")}
                >
                  Login / Sign Up as Student
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => setSelectedRole(null)}
            >
              ← Back to options
            </Button>
            <AuthModal role={selectedRole} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
