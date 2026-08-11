import {
  IconFolder,
  IconDotsVertical,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookCategory } from "@/api/books";

interface CategoryCardProps {
  category: BookCategory;
  onOpen: (category: BookCategory) => void;
  onDelete: (categoryId: string) => void;
  deleting: boolean;
}

export default function CategoryCard({
  category,
  onOpen,
  onDelete,
  deleting,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      className="group relative flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-[#B8975A]/50 hover:bg-[#B8975A]/5"
    >
      <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            {deleting ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconDotsVertical className="h-4 w-4" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
              }}
            >
              <IconTrash className="ml-2 h-4 w-4" />
              حذف القسم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <IconFolder className="h-10 w-10 text-[#B8975A]" strokeWidth={1.5} />

      <span className="line-clamp-2 w-full text-sm font-medium text-foreground">
        {category.name}
      </span>
    </button>
  );
}
