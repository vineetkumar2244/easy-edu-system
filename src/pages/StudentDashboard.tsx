
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ClassSelector } from "@/components/student/ClassSelector";
import { LessonCard } from "@/components/student/LessonCard";
import { QuizCard } from "@/components/student/QuizCard";
import { useData, ClassLevel } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentDashboard = () => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [activeTab, setActiveTab] = useState("lessons");
  const { getContentsByClass, getQuizzesByClass } = useData();
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.role !== "student") {
    return <Navigate to="/" />;
  }
  
  // Auto-select class if user has one
  if (!selectedClass && user?.class) {
    setSelectedClass(user.class as ClassLevel);
  }
  
  const contents = selectedClass ? getContentsByClass(selectedClass) : [];
  const quizzes = selectedClass ? getQuizzesByClass(selectedClass) : [];
  
  const videos = contents.filter(content => content.type === "video");
  const pdfs = contents.filter(content => content.type === "pdf");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Access your learning materials and quizzes
          </p>
        </div>
        
        {!selectedClass ? (
          <div className="py-12">
            <div className="max-w-md mx-auto text-center space-y-4">
              <h2 className="text-xl font-medium">Select Your Class</h2>
              <p className="text-muted-foreground">
                Choose your class to access your learning materials
              </p>
              <ClassSelector onSelectClass={setSelectedClass} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">{selectedClass} Grade Materials</h2>
              <ClassSelector onSelectClass={setSelectedClass} />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="flex w-full max-w-md">
                <TabsTrigger value="lessons" className="flex-1">Lessons</TabsTrigger>
                <TabsTrigger value="quizzes" className="flex-1">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="space-y-6">
                {videos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Video Lessons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map(video => (
                        <LessonCard key={video.id} content={video} />
                      ))}
                    </div>
                  </div>
                )}
                
                {pdfs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">PDF Materials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pdfs.map(pdf => (
                        <LessonCard key={pdf.id} content={pdf} />
                      ))}
                    </div>
                  </div>
                )}
                
                {videos.length === 0 && pdfs.length === 0 && (
                  <div className="text-center py-12 border rounded-md bg-white">
                    <p className="text-muted-foreground">
                      No learning materials available for {selectedClass} Grade yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="quizzes">
                {quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.map(quiz => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-white">
                    <p className="text-muted-foreground">
                      No quizzes available for {selectedClass} Grade yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
