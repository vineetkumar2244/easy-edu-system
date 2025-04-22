
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{quiz.title}</CardTitle>
        <CardDescription className="text-sm">
          {quiz.questions.length} questions • Added on {format(new Date(quiz.createdAt), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full bg-edu-accent text-edu-dark hover:bg-edu-accent/90"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
