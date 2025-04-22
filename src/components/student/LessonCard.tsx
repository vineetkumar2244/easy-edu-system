
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Content } from "@/contexts/DataContext";
import { Download, FileVideo, FilePdf } from "lucide-react";
import { format } from "date-fns";

interface LessonCardProps {
  content: Content;
}

export function LessonCard({ content }: LessonCardProps) {
  const handleDownload = () => {
    // In a real app, this would trigger a download from a server
    // For now, we'll just open the content URL
    window.open(content.url, "_blank");
  };

  const handleView = () => {
    window.open(content.url, "_blank");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              Added on {format(new Date(content.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <div className="bg-edu-light p-2 rounded-md">
            {content.type === "video" ? (
              <FileVideo className="h-5 w-5 text-edu-primary" />
            ) : (
              <FilePdf className="h-5 w-5 text-edu-danger" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{content.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="secondary" className="flex-1" onClick={handleView}>
          {content.type === "video" ? "Watch" : "Read"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
