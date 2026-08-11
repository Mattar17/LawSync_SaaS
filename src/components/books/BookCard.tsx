import {
  IconFileText,
  IconDotsVertical,
  IconTrash,
  IconPencil,
  IconLoader2,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "@/api/books";

interface BookCardProps {
  book: Book;
  onOpen: (bookId: string) => void;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  opening: boolean;
  deleting: boolean;
}

export default function BookCard({
  book,
  onOpen,
  onEdit,
  onDelete,
  opening,
  deleting,
}: BookCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(book.id)}
      disabled={opening}
      className="group relative flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-[#B8975A]/50 hover:bg-[#B8975A]/5 disabled:opacity-60"
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book);
              }}
            >
              <IconPencil className="ml-2 h-4 w-4" />
              تعديل البيانات
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book.id);
              }}
            >
              <IconTrash className="ml-2 h-4 w-4" />
              حذف الكتاب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {opening ? (
        <IconLoader2
          className="h-10 w-10 animate-spin text-[#B8975A]"
          strokeWidth={1.5}
        />
      ) : (
        <IconFileText className="h-10 w-10 text-[#B8975A]" strokeWidth={1.5} />
      )}

      <div className="w-full">
        <p className="line-clamp-2 text-sm font-medium text-foreground">
          {book.title}
        </p>
      </div>
    </button>
  );
}
