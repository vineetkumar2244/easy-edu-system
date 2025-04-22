
import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="py-4 border-t bg-white">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EasyEdu System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
