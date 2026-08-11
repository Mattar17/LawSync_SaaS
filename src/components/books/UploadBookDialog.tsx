import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2, IconUpload } from "@tabler/icons-react";
import { BookCategory } from "@/api/books";

interface UploadBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploading: boolean;
  categories: BookCategory[];
  defaultCategoryId?: string;
  onUpload: (form: {
    categoryId: string;
    title: string;
    description?: string;
    file: File;
  }) => Promise<boolean>;
}

export default function UploadBookDialog({
  open,
  onOpenChange,
  uploading,
  categories,
  defaultCategoryId,
  onUpload,
}: UploadBookDialogProps) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) setCategoryId(defaultCategoryId ?? "");
  }, [open, defaultCategoryId]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !file || !categoryId) return;
    const success = await onUpload({
      categoryId,
      title: title.trim(),
      description: description.trim() || undefined,
      file,
    });
    if (success) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-right">
        <DialogHeader>
          <DialogTitle>إضافة كتاب</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book-category">القسم</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="book-category" className="h-9 rounded-lg">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-title">عنوان الكتاب</Label>
            <Input
              id="book-title"
              className="h-9 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-description">وصف مختصر (اختياري)</Label>
            <Textarea
              id="book-description"
              className="rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-file">ملف الكتاب</Label>
            <label
              htmlFor="book-file"
              className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-[#B8975A]/50 hover:text-[#B8975A]"
            >
              <IconUpload className="h-6 w-6" />
              {file ? file.name : "اضغط لاختيار ملف"}
            </label>
            <input
              id="book-file"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="bg-[#B8975A] hover:bg-[#B8975A]/90"
            disabled={uploading || !title.trim() || !file || !categoryId}
            onClick={handleSubmit}
          >
            {uploading && <IconLoader2 className="ml-2 h-4 w-4 animate-spin" />}
            رفع الكتاب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
