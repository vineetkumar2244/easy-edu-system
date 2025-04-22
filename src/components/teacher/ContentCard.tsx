
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Content } from "@/contexts/DataContext";
import { FileVideo, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
}

export function ContentCard({ content, onDelete }: ContentCardProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(content.id);
    toast({
      title: "Content deleted",
      description: `${content.title} has been removed.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              Added on {format(new Date(content.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-edu-light p-2 rounded-md">
              {content.type === "video" ? (
                <FileVideo className="h-5 w-5 text-edu-primary" />
              ) : (
                <FileText className="h-5 w-5 text-edu-danger" />
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Content</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{content.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content.description}</p>
        <p className="text-sm text-muted-foreground mt-2">Class: {content.classLevel}</p>
      </CardContent>
    </Card>
  );
}
