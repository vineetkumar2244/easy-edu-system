
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadContent } from "@/components/teacher/UploadContent";
import { QuizCreator } from "@/components/teacher/QuizCreator";
import { StudentProgress } from "@/components/teacher/StudentProgress";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not a teacher
  if (!isAuthenticated || user?.role !== "teacher") {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classes, upload content, and track student progress
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="quiz">Create Quiz</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <UploadContent />
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-4">
            <QuizCreator />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-4">
            <StudentProgress />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
