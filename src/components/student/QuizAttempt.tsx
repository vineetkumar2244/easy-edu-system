
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData, QuizQuestion } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export function QuizAttempt() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuizById, addQuizAttempt } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const quiz = getQuizById(quizId || "");
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!quiz) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-edu-secondary">Quiz Not Found</h2>
            <p className="mt-2 text-muted-foreground">The quiz you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => navigate("/student")}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  const handleOptionSelect = (value: string) => {
    setSelectedOption(parseInt(value));
  };
  
  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: "Selection Required",
        description: "Please select an answer to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
    
    // Move to next question or submit if at the end
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
    }
  };
  
  const handleSubmitQuiz = async (finalAnswers: number[]) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate score
      let score = 0;
      const questionAnswers = quiz.questions.map((q, index) => {
        const selectedOption = finalAnswers[index];
        if (selectedOption === q.correctOption) {
          score++;
        }
        return {
          questionId: q.id,
          selectedOption,
        };
      });
      
      // Submit quiz attempt
      addQuizAttempt({
        quizId: quiz.id,
        studentId: user.id,
        studentName: user.name,
        score,
        totalQuestions: quiz.questions.length,
        answers: questionAnswers,
      });
      
      // Show success message
      toast({
        title: "Quiz Submitted",
        description: `Your score: ${score}/${quiz.questions.length}`,
      });
      
      // Navigate to results
      navigate(`/quiz-result/${quiz.id}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          </div>
          
          <RadioGroup value={selectedOption?.toString() || ""} onValueChange={handleOptionSelect}>
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={selectedOption === null || isSubmitting}
          className="bg-edu-primary hover:bg-edu-secondary"
        >
          {currentQuestionIndex < quiz.questions.length - 1
            ? "Next Question"
            : isSubmitting
            ? "Submitting..."
            : "Submit Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
