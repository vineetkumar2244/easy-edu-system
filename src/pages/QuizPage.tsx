
import { Layout } from "@/components/layout/Layout";
import { QuizAttempt } from "@/components/student/QuizAttempt";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const QuizPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.role !== "student") {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="py-4">
        <QuizAttempt />
      </div>
    </Layout>
  );
};

export default QuizPage;
