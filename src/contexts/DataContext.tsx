import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type ContentType = "video" | "pdf";
export type ClassLevel = "5th" | "6th" | "7th" | "8th" | "9th" | "10th";

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  url: string;
  classLevel: ClassLevel;
  createdAt: string;
  createdBy: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  classLevel: ClassLevel;
  questions: QuizQuestion[];
  createdAt: string;
  createdBy: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: { questionId: string; selectedOption: number }[];
}

interface DataContextType {
  contents: Content[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  addContent: (content: Omit<Content, "id" | "createdAt">) => void;
  addQuiz: (quiz: Omit<Quiz, "id" | "createdAt">) => void;
  addQuizAttempt: (attempt: Omit<QuizAttempt, "id" | "submittedAt">) => void;
  deleteContent: (contentId: string) => void;
  deleteQuiz: (quizId: string) => void;
  getContentsByClass: (classLevel: ClassLevel) => Content[];
  getQuizzesByClass: (classLevel: ClassLevel) => Quiz[];
  getAttemptsByQuiz: (quizId: string) => QuizAttempt[];
  getAttemptsByStudent: (studentId: string) => QuizAttempt[];
  getQuizById: (id: string) => Quiz | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const mockContents: Content[] = [
  {
    id: "c1",
    title: "Introduction to Algebra",
    description: "Basic concepts of algebra for beginners",
    type: "video",
    url: "https://example.com/algebra-intro.mp4",
    classLevel: "6th",
    createdAt: new Date().toISOString(),
    createdBy: "teacher1",
  },
  {
    id: "c2",
    title: "Photosynthesis Explained",
    description: "How plants make their own food",
    type: "pdf",
    url: "https://example.com/photosynthesis.pdf",
    classLevel: "7th",
    createdAt: new Date().toISOString(),
    createdBy: "teacher1",
  },
];

const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Algebra Basics Quiz",
    description: "Test your understanding of basic algebraic concepts",
    classLevel: "6th",
    questions: [
      {
        id: "q1_1",
        question: "What is the value of x in 2x + 5 = 15?",
        options: ["3", "5", "7", "10"],
        correctOption: 1,
      },
      {
        id: "q1_2",
        question: "Simplify: 3(x + 2) - 4",
        options: ["3x + 2", "3x + 6 - 4", "3x + 6", "3x + 2 - 4"],
        correctOption: 2,
      },
    ],
    createdAt: new Date().toISOString(),
    createdBy: "teacher1",
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    // Load from localStorage or use mock data on first load
    const storedContents = localStorage.getItem("eduContents");
    const storedQuizzes = localStorage.getItem("eduQuizzes");
    const storedAttempts = localStorage.getItem("eduAttempts");

    setContents(storedContents ? JSON.parse(storedContents) : mockContents);
    setQuizzes(storedQuizzes ? JSON.parse(storedQuizzes) : mockQuizzes);
    setAttempts(storedAttempts ? JSON.parse(storedAttempts) : []);
  }, []);

  // Update localStorage when data changes
  useEffect(() => {
    localStorage.setItem("eduContents", JSON.stringify(contents));
    localStorage.setItem("eduQuizzes", JSON.stringify(quizzes));
    localStorage.setItem("eduAttempts", JSON.stringify(attempts));
  }, [contents, quizzes, attempts]);

  const addContent = (content: Omit<Content, "id" | "createdAt">) => {
    const newContent: Content = {
      ...content,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    setContents(prev => [...prev, newContent]);
  };

  const addQuiz = (quiz: Omit<Quiz, "id" | "createdAt">) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const addQuizAttempt = (attempt: Omit<QuizAttempt, "id" | "submittedAt">) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Math.random().toString(36).substring(2),
      submittedAt: new Date().toISOString(),
    };
    setAttempts(prev => [...prev, newAttempt]);
  };

  const deleteContent = (contentId: string) => {
    setContents(prev => prev.filter(content => content.id !== contentId));
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    // Also delete related attempts
    setAttempts(prev => prev.filter(attempt => attempt.quizId !== quizId));
  };

  const getContentsByClass = (classLevel: ClassLevel) => {
    return contents.filter(content => content.classLevel === classLevel);
  };

  const getQuizzesByClass = (classLevel: ClassLevel) => {
    return quizzes.filter(quiz => quiz.classLevel === classLevel);
  };

  const getAttemptsByQuiz = (quizId: string) => {
    return attempts.filter(attempt => attempt.quizId === quizId);
  };

  const getAttemptsByStudent = (studentId: string) => {
    return attempts.filter(attempt => attempt.studentId === studentId);
  };

  const getQuizById = (id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        contents,
        quizzes,
        attempts,
        addContent,
        addQuiz,
        addQuizAttempt,
        deleteContent,
        deleteQuiz,
        getContentsByClass,
        getQuizzesByClass,
        getAttemptsByQuiz,
        getAttemptsByStudent,
        getQuizById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
