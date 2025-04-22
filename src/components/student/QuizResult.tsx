
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuizResult() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuizById, attempts, getAttemptsByStudent } = useData();
  const { user } = useAuth();
  
  const quiz = getQuizById(quizId || "");
  
  if (!quiz || !user) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-edu-secondary">Results Not Found</h2>
            <p className="mt-2 text-muted-foreground">We couldn't find the quiz results you're looking for.</p>
            <Button className="mt-4" onClick={() => navigate("/student")}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const studentAttempts = getAttemptsByStudent(user.id).filter(a => a.quizId === quiz.id);
  const latestAttempt = studentAttempts.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )[0];
  
  if (!latestAttempt) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-edu-secondary">No Attempts Found</h2>
            <p className="mt-2 text-muted-foreground">You haven't submitted this quiz yet.</p>
            <Button className="mt-4" onClick={() => navigate(`/quiz/${quiz.id}`)}>
              Take Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const percentage = Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100);
  
  // Calculate result message and color
  let resultMessage = "";
  let resultColor = "";
  
  if (percentage >= 90) {
    resultMessage = "Excellent! You've mastered this topic.";
    resultColor = "text-edu-success";
  } else if (percentage >= 75) {
    resultMessage = "Great job! You have a good understanding.";
    resultColor = "text-green-600";
  } else if (percentage >= 60) {
    resultMessage = "Good work! Keep practicing to improve.";
    resultColor = "text-yellow-600";
  } else {
    resultMessage = "Keep studying! Review the material and try again.";
    resultColor = "text-edu-danger";
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results: {quiz.title}</CardTitle>
        <CardDescription>
          Submitted on {new Date(latestAttempt.submittedAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-8">
            <span className="text-4xl font-bold">
              {latestAttempt.score}/{latestAttempt.totalQuestions}
            </span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{percentage}%</h3>
            <p className={`text-lg ${resultColor}`}>{resultMessage}</p>
          </div>
          
          {/* Could add question-by-question review here */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <Button variant="outline" onClick={() => navigate("/student")}>
          Return to Dashboard
        </Button>
        <Button
          className="bg-edu-primary hover:bg-edu-secondary"
          onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
          Retake Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
