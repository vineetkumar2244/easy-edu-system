
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Content } from "@/contexts/DataContext";
import { Download, FileVideo, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getFile } from "@/utils/fileStorage";

interface LessonCardProps {
  content: Content;
}

export function LessonCard({ content }: LessonCardProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  
  // Get the file data from storage
  const getFileData = () => {
    // If it's a stored file path, get the file from storage
    if (content.url.startsWith('uploads/')) {
      const fileData = getFile(content.url);
      if (!fileData) {
        toast({
          title: "File not found",
          description: "The file could not be found in storage.",
          variant: "destructive",
        });
        return null;
      }
      return fileData;
    }
    
    // For backward compatibility with existing content that might use a direct URL
    return {
      url: content.url,
      name: content.title,
      type: content.type === 'video' ? 'video/mp4' : 'application/pdf'
    };
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      const fileData = getFileData();
      if (!fileData) {
        setIsDownloading(false);
        return;
      }
      
      const a = document.createElement('a');
      a.href = fileData.url;
      a.download = fileData.name || `${content.title}.${content.type === "video" ? "mp4" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: `${content.title} is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again later.",
        variant: "destructive",
      });
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    try {
      setIsViewing(true);
      
      const fileData = getFileData();
      if (!fileData) {
        setIsViewing(false);
        return;
      }
      
      const iframe = document.createElement('iframe');
      iframe.src = fileData.url;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.backgroundColor = 'white';
      iframe.style.zIndex = '9999';
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.position = 'fixed';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.zIndex = '10000';
      closeButton.style.padding = '5px 10px';
      closeButton.style.backgroundColor = '#f44336';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      
      closeButton.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeButton);
        document.body.style.overflow = 'auto';
        setIsViewing(false);
      };
      
      document.body.style.overflow = 'hidden';
      document.body.appendChild(iframe);
      document.body.appendChild(closeButton);
      
      iframe.onerror = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeButton);
        document.body.style.overflow = 'auto';
        setIsViewing(false);
        
        toast({
          title: "Content failed to load",
          description: "Unable to display the content. Try downloading it instead.",
          variant: "destructive",
        });
      };
    } catch (error) {
      setIsViewing(false);
      toast({
        title: "Unable to open content",
        description: "There was a problem opening this content. Please try downloading it instead.",
        variant: "destructive",
      });
      console.error("View error:", error);
    }
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
              <FileText className="h-5 w-5 text-edu-danger" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{content.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="secondary" 
          className="flex-1" 
          onClick={handleView}
          disabled={isViewing}
        >
          {content.type === "video" ? 
            (isViewing ? "Loading..." : "Watch") : 
            (isViewing ? "Loading..." : "Read")}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleDownload} 
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-1" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </CardFooter>
    </Card>
  );
}
