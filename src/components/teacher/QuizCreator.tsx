
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, ClassLevel, QuizQuestion } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function QuizCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classLevel, setClassLevel] = useState<ClassLevel | "">("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  // New question form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState<number>(0);
  
  const { addQuiz } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const classOptions: ClassLevel[] = ["5th", "6th", "7th", "8th", "9th", "10th"];

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      // Adjust correctOption if needed
      if (correctOption >= index && correctOption > 0) {
        setCorrectOption(correctOption - 1);
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSaveQuestion = () => {
    if (!questionText || options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in the question and all options",
        variant: "destructive",
      });
      return;
    }
    
    const newQuestion: QuizQuestion = {
      id: Math.random().toString(36).substring(2),
      question: questionText,
      options: [...options],
      correctOption,
    };
    
    if (editingQuestionIndex !== null) {
      // Edit existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }
    
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    setShowQuestionForm(false);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setQuestionText(question.question);
    setOptions([...question.options]);
    setCorrectOption(question.correctOption);
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !classLevel || questions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and add at least one question",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      addQuiz({
        title,
        description,
        classLevel: classLevel as ClassLevel,
        questions,
        createdBy: user?.id || "",
      });
      
      toast({
        title: "Success",
        description: "Quiz created successfully",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setClassLevel("");
      setQuestions([]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Quiz</CardTitle>
        <CardDescription>
          Create multiple-choice quizzes for your students
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="End of Chapter Algebra Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class-level">Class Level</Label>
            <Select value={classLevel} onValueChange={(value) => setClassLevel(value as ClassLevel)}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} Grade
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Questions ({questions.length})</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => {
                      resetQuestionForm();
                      setShowQuestionForm(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Question</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{editingQuestionIndex !== null ? "Edit Question" : "Add New Question"}</DialogTitle>
                    <DialogDescription>
                      Create a multiple-choice question with options
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-text">Question</Label>
                      <Textarea
                        id="question-text"
                        placeholder="Enter your question here..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <RadioGroup value={correctOption.toString()} onValueChange={(value) => setCorrectOption(parseInt(value))}>
                              <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                            </RadioGroup>
                            <Input
                              id={`option-text-${idx}`}
                              placeholder={`Option ${idx + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(idx, e.target.value)}
                              className="flex-1"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(idx)}
                              disabled={options.length <= 2}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                        disabled={options.length >= 6}
                        className="mt-2"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select the correct answer using the radio buttons
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetQuestionForm}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveQuestion}>
                      {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {questions.length > 0 ? (
              <div className="space-y-2 border rounded-md p-2">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-2 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Question {idx + 1}</h4>
                        <p className="text-sm">{q.question}</p>
                        <ul className="text-sm mt-1 space-y-1">
                          {q.options.map((opt, optIdx) => (
                            <li key={optIdx} className={optIdx === q.correctOption ? "font-medium text-edu-success" : ""}>
                              {optIdx === q.correctOption ? "✓ " : ""}{opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditQuestion(idx)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveQuestion(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground border rounded-md">
                No questions added yet. Click "Add Question" to start.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-edu-primary hover:bg-edu-secondary" disabled={isLoading || questions.length === 0}>
            {isLoading ? "Creating..." : "Create Quiz"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
