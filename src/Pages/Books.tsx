import { useState } from "react";
import useBooks from "@/hooks/useBooks";
import CategoryCard from "@/components/books/CategoryCard";
import BookCard from "@/components/books/BookCard";
import AddTile from "@/components/books/AddTile";
import CreateCategoryDialog from "@/components/books/CreateCategoryDialog";
import UploadBookDialog from "@/components/books/UploadBookDialog";
import EditBookDialog from "@/components/books/EditBookDialog";
import { Book } from "@/api/books";
import { IconArrowRight, IconLoader2, IconBooks } from "@tabler/icons-react";

export default function BooksPage() {
  const {
    categories,
    loadingCategories,
    creatingCategory,
    deletingCategoryId,

    selectedCategory,
    books,
    loadingBooks,
    uploadingBook,
    deletingBookId,
    updatingBookId,
    openingBookId,

    openCategory,
    closeCategory,

    handleCreateCategory,
    handleDeleteCategory,
    handleUploadBook,
    handleDeleteBook,
    handleUpdateBookInfo,
    handleOpenBook,
  } = useBooks();

  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [uploadBookOpen, setUploadBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header / breadcrumb */}
      <div className="flex items-center gap-3">
        {selectedCategory ? (
          <>
            <button
              type="button"
              onClick={closeCategory}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {selectedCategory.name}
            </h1>
          </>
        ) : (
          <>
            <IconBooks className="h-5 w-5 text-[#B8975A]" />
            <h1 className="text-lg font-semibold text-foreground">
              مكتبة الكتب القانونية
            </h1>
          </>
        )}
      </div>

      {/* Categories grid */}
      {!selectedCategory && (
        <>
          {loadingCategories ? (
            <div className="flex justify-center py-10">
              <IconLoader2 className="h-6 w-6 animate-spin text-[#B8975A]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <AddTile
                label="إضافة قسم"
                onClick={() => setCreateCategoryOpen(true)}
              />
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onOpen={openCategory}
                  onDelete={handleDeleteCategory}
                  deleting={deletingCategoryId === category.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Books grid (within selected category) */}
      {selectedCategory && (
        <>
          {loadingBooks ? (
            <div className="flex justify-center py-10">
              <IconLoader2 className="h-6 w-6 animate-spin text-[#B8975A]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <AddTile
                label="إضافة كتاب"
                onClick={() => setUploadBookOpen(true)}
              />
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={handleOpenBook}
                  onEdit={setEditingBook}
                  onDelete={handleDeleteBook}
                  opening={openingBookId === book.id}
                  deleting={deletingBookId === book.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        creating={creatingCategory}
        onCreate={handleCreateCategory}
      />

      <UploadBookDialog
        open={uploadBookOpen}
        onOpenChange={setUploadBookOpen}
        uploading={uploadingBook}
        categories={categories}
        defaultCategoryId={selectedCategory?.id}
        onUpload={handleUploadBook}
      />

      <EditBookDialog
        book={editingBook}
        categories={categories}
        onOpenChange={(open) => !open && setEditingBook(null)}
        updating={updatingBookId === editingBook?.id}
        onSave={handleUpdateBookInfo}
      />
    </div>
  );
}
