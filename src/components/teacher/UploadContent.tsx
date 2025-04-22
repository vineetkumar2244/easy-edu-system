
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, ContentType, ClassLevel } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export function UploadContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType | "">("");
  const [classLevel, setClassLevel] = useState<ClassLevel | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addContent } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const contentTypes: ContentType[] = ["video", "pdf"];
  const classOptions: ClassLevel[] = ["5th", "6th", "7th", "8th", "9th", "10th"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !contentType || !classLevel || !file) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload a file",
        variant: "destructive",
      });
      return;
    }
    
    if (contentType === "video" && !file.type.includes("video")) {
      toast({
        title: "Error",
        description: "Please upload a valid video file",
        variant: "destructive",
      });
      return;
    }
    
    if (contentType === "pdf" && !file.type.includes("pdf")) {
      toast({
        title: "Error",
        description: "Please upload a valid PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would upload the file to a server
      // For now, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      addContent({
        title,
        description,
        type: contentType as ContentType,
        url: fakeUrl,
        classLevel: classLevel as ClassLevel,
        createdBy: user?.id || "",
      });
      
      toast({
        title: "Success",
        description: "Content uploaded successfully",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setContentType("");
      setClassLevel("");
      setFile(null);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Learning Material</CardTitle>
        <CardDescription>
          Upload video lessons or PDF documents for your students
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Introduction to Fractions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Lesson</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept={contentType === "video" ? "video/*" : contentType === "pdf" ? "application/pdf" : undefined}
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              required
            />
            <p className="text-sm text-muted-foreground">
              {contentType === "video"
                ? "Accepted formats: MP4, WebM, etc."
                : contentType === "pdf"
                ? "Accepted format: PDF"
                : "Please select a content type first"}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-edu-primary hover:bg-edu-secondary" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Content"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
