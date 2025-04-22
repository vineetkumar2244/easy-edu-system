
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useData, Quiz, QuizAttempt } from "@/contexts/DataContext";
import { Download } from "lucide-react";

export function StudentProgress() {
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const { quizzes, getAttemptsByQuiz } = useData();
  
  const attempts = selectedQuiz ? getAttemptsByQuiz(selectedQuiz) : [];
  const selectedQuizData = quizzes.find(quiz => quiz.id === selectedQuiz);
  
  const handleExportCSV = () => {
    if (!attempts.length || !selectedQuizData) return;
    
    // Create CSV content
    const headers = ["Student ID", "Student Name", "Score", "Total Questions", "Percentage", "Submission Date"];
    const rows = attempts.map(attempt => [
      attempt.studentId,
      attempt.studentName,
      attempt.score.toString(),
      attempt.totalQuestions.toString(),
      `${Math.round((attempt.score / attempt.totalQuestions) * 100)}%`,
      new Date(attempt.submittedAt).toLocaleString()
    ]);
    
    const csvContent = [
      `Quiz: ${selectedQuizData.title}`,
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedQuizData.title.replace(/\s+/g, "-")}-results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress Tracker</CardTitle>
        <CardDescription>
          Track and analyze student performance on quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title} ({quiz.classLevel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleExportCSV}
              disabled={!selectedQuiz || attempts.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedQuiz ? (
            attempts.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                      <TableHead className="text-right">Submission Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium">{attempt.studentName}</TableCell>
                        <TableCell className="text-right">{attempt.score} / {attempt.totalQuestions}</TableCell>
                        <TableCell className="text-right">
                          {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                No attempts have been made for this quiz yet.
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              Please select a quiz to view student progress.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
