
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  role: "teacher" | "student";
}

export function AuthModal({ role }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isLogin ? (
        <LoginForm role={role} onToggleForm={toggleForm} />
      ) : (
        <SignupForm role={role} onToggleForm={toggleForm} />
      )}
    </div>
  );
}
