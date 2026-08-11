import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2 } from "@tabler/icons-react";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creating: boolean;
  onCreate: (name: string) => Promise<boolean>;
}

export default function CreateCategoryDialog({
  open,
  onOpenChange,
  creating,
  onCreate,
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const success = await onCreate(name.trim());
    if (success) {
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-right">
        <DialogHeader>
          <DialogTitle>إضافة قسم جديد</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="category-name">اسم القسم</Label>
          <Input
            id="category-name"
            className="h-9 rounded-lg"
            placeholder="مثال: القانون المدني"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button
            className="bg-[#B8975A] hover:bg-[#B8975A]/90"
            disabled={creating || !name.trim()}
            onClick={handleSubmit}
          >
            {creating && <IconLoader2 className="ml-2 h-4 w-4 animate-spin" />}
            إضافة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
