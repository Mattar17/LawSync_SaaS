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
import { IconLoader2 } from "@tabler/icons-react";
import { Book, BookCategory } from "@/api/books";

interface EditBookDialogProps {
  book: Book | null;
  categories: BookCategory[];
  onOpenChange: (open: boolean) => void;
  updating: boolean;
  onSave: (
    bookId: string,
    form: { title?: string; categoryId?: string; description?: string },
  ) => Promise<boolean>;
}

export default function EditBookDialog({
  book,
  categories,
  onOpenChange,
  updating,
  onSave,
}: EditBookDialogProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setCategoryId(book.category_id);
      setDescription(book.description ?? "");
    }
  }, [book]);

  const handleSubmit = async () => {
    if (!book || !title.trim() || !categoryId) return;
    const success = await onSave(book.id, {
      title: title.trim(),
      categoryId,
      description: description.trim() || undefined,
    });
    if (success) onOpenChange(false);
  };

  return (
    <Dialog open={!!book} onOpenChange={onOpenChange}>
      <DialogContent className="text-right">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الكتاب</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">عنوان الكتاب</Label>
            <Input
              id="edit-title"
              className="h-9 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">القسم</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="edit-category" className="h-9 rounded-lg">
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
            <Label htmlFor="edit-description">وصف مختصر (اختياري)</Label>
            <Textarea
              id="edit-description"
              className="rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="bg-[#B8975A] hover:bg-[#B8975A]/90"
            disabled={updating || !title.trim() || !categoryId}
            onClick={handleSubmit}
          >
            {updating && <IconLoader2 className="ml-2 h-4 w-4 animate-spin" />}
            حفظ التعديلات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
