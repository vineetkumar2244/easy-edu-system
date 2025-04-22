
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ClassLevel } from "@/contexts/DataContext";

interface ClassSelectorProps {
  onSelectClass: (classLevel: ClassLevel) => void;
}

export function ClassSelector({ onSelectClass }: ClassSelectorProps) {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<ClassLevel | "">(user?.class as ClassLevel || "");
  
  const classOptions: ClassLevel[] = ["5th", "6th", "7th", "8th", "9th", "10th"];

  const handleSelectClass = () => {
    if (selectedClass) {
      onSelectClass(selectedClass);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-4 bg-white rounded-md shadow-sm">
      <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as ClassLevel)}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select your class" />
        </SelectTrigger>
        <SelectContent>
          {classOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option} Grade
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleSelectClass} 
        disabled={!selectedClass}
        className="bg-edu-primary hover:bg-edu-secondary"
      >
        Access Materials
      </Button>
    </div>
  );
}
