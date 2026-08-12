import { useState, useEffect, useCallback } from "react";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getAllBooksInCategory,
  uploadBook,
  deleteBook,
  updateBookInfo,
  getFileUrl,
  BookCategory,
  Book,
} from "@/api/books";
import { toast } from "sonner";

export default function useBooks() {
  // ================= CATEGORIES =================
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await getAllCategories();

      if (!res.success) {
        toast.error(res.message || "فشل تحميل الأقسام");
        return;
      }
      setCategories(res.data);
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ================= BOOKS (within a selected category) =================
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(
    null,
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null);
  const [openingBookId, setOpeningBookId] = useState<string | null>(null);

  const fetchBooks = useCallback(async (categoryId: string) => {
    setLoadingBooks(true);
    try {
      const res = await getAllBooksInCategory(categoryId);

      if (!res.success) {
        toast.error(res.message || "فشل تحميل الكتب");
        return;
      }
      setBooks(res.data);
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  const openCategory = useCallback(
    (category: BookCategory) => {
      setSelectedCategory(category);
      fetchBooks(category.id);
    },
    [fetchBooks],
  );

  const closeCategory = useCallback(() => {
    setSelectedCategory(null);
    setBooks([]);
  }, []);

  // ================= CREATE CATEGORY =================
  const handleCreateCategory = useCallback(
    async (name: string) => {
      setCreatingCategory(true);
      try {
        const res = await createCategory({ name });

        if (!res.success) {
          toast.error(res.message || "فشل إضافة القسم");
          return false;
        }
        console.log("response data", res.data);
        if (res.data) {
          setCategories((prev) => [res.data as BookCategory, ...prev]);
        }

        toast.success("تم إضافة القسم بنجاح");
        return true;
      } catch {
        toast.error("حدث خطأ ما");
        return false;
      } finally {
        setCreatingCategory(false);
      }
    },
    [creatingCategory],
  );

  // ================= DELETE CATEGORY =================
  const handleDeleteCategory = async (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    try {
      const res = await deleteCategory(categoryId);

      if (!res.success) {
        toast.error(res.message || "فشل حذف القسم");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      if (selectedCategory?.id === categoryId) {
        closeCategory();
      }
      toast.info(res.message || "تم حذف القسم");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // ================= UPLOAD BOOK =================
  const handleUploadBook = async (form: {
    categoryId: string;
    title: string;
    description?: string;
    file: File;
  }) => {
    setUploadingBook(true);
    try {
      const { categoryId, ...rest } = form;
      const res = await uploadBook(categoryId, rest);

      if (!res.success) {
        toast.error(res.message || "فشل رفع الكتاب");
        return false;
      }

      if (res.data && res.data.category_id === selectedCategory?.id) {
        setBooks((prev) => [res.data as Book, ...prev]);
      }

      toast.success("تم رفع الكتاب بنجاح");
      return true;
    } catch {
      toast.error("حدث خطأ ما");
      return false;
    } finally {
      setUploadingBook(false);
    }
  };

  // ================= DELETE BOOK =================
  const handleDeleteBook = async (bookId: string) => {
    setDeletingBookId(bookId);
    try {
      const res = await deleteBook(bookId);

      if (!res.success) {
        toast.error(res.message || "فشل حذف الكتاب");
        return;
      }

      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.info(res.message || "تم حذف الكتاب");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setDeletingBookId(null);
    }
  };

  // ================= UPDATE BOOK INFO =================
  const handleUpdateBookInfo = async (
    bookId: string,
    form: { title?: string; categoryId?: string; description?: string },
  ) => {
    setUpdatingBookId(bookId);
    try {
      const res = await updateBookInfo(bookId, form);

      if (!res.success) {
        toast.error(res.message || "فشل تعديل بيانات الكتاب");
        return false;
      }

      if (res.data) {
        const updated = res.data;
        setBooks((prev) => {
          // Moved to a different category than the one currently open — drop it here
          if (selectedCategory && updated.category_id !== selectedCategory.id) {
            return prev.filter((b) => b.id !== bookId);
          }
          return prev.map((b) => (b.id === bookId ? { ...b, ...updated } : b));
        });
      }

      toast.success("تم تعديل بيانات الكتاب بنجاح");
      return true;
    } catch {
      toast.error("حدث خطأ ما");
      return false;
    } finally {
      setUpdatingBookId(null);
    }
  };

  // ================= OPEN BOOK FILE =================
  const handleOpenBook = async (bookId: string) => {
    setOpeningBookId(bookId);
    try {
      const res = await getFileUrl(bookId);
      if (!res.success || !res.data?.url) {
        toast.error(res.message || "فشل فتح الكتاب");
        return;
      }
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setOpeningBookId(null);
    }
  };

  return {
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
    refetchCategories: fetchCategories,
    refetchBooks: () =>
      selectedCategory ? fetchBooks(selectedCategory.id) : undefined,

    handleCreateCategory,
    handleDeleteCategory,
    handleUploadBook,
    handleDeleteBook,
    handleUpdateBookInfo,
    handleOpenBook,
  };
}
