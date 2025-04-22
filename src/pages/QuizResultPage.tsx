
import { Layout } from "@/components/layout/Layout";
import { QuizResult } from "@/components/student/QuizResult";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const QuizResultPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.role !== "student") {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="py-4">
        <QuizResult />
      </div>
    </Layout>
  );
};

export default QuizResultPage;
