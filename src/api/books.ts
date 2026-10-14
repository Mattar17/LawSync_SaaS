import { apiRequest } from "./client";

export interface BookCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Book {
  id: string;
  category_id: string;
  title: string;
  description?: string | null;
  storage_path: string;
  uploaded_by: string;
  file_ext: string;
  file_size_bytes: number;
  created_at: string;
  updated_at: string;
}

// POST /api/books/category
export async function createCategory(form: { name: string }) {
  return apiRequest<BookCategory>("/api/books/category", {
    method: "POST",
    data: form,
  });
}

// GET /api/books/category
export async function getAllCategories() {
  const res = await apiRequest<BookCategory[]>("/api/books/category", {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

// DELETE /api/books/category/:categoryId
export async function deleteCategory(categoryId: string) {
  return apiRequest<void>(`/api/books/category/${categoryId}`, {
    method: "DELETE",
  });
}

// POST /api/books/upload (multipart/form-data)
export async function uploadBook(
  categoryId: string,
  form: { title: string; description?: string; file: File },
) {
  const formData = new FormData();
  formData.append("categoryId", categoryId);
  formData.append("title", form.title);
  if (form.description) formData.append("description", form.description);
  formData.append("file", form.file);

  return apiRequest<Book>("/api/books/upload", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// GET /api/books/category/:categoryId
export async function getAllBooksInCategory(categoryId: string) {
  const res = await apiRequest<Book[]>(`/api/books/category/${categoryId}`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

// GET /api/books/:bookId
export async function getFileUrl(bookId: string) {
  return apiRequest<{ url: string }>(`/api/books/${bookId}`, {
    method: "GET",
  });
}

// DELETE /api/books/:bookId
export async function deleteBook(bookId: string) {
  return apiRequest<void>(`/api/books/${bookId}`, {
    method: "DELETE",
  });
}

// PATCH /api/books/:bookId
export async function updateBookInfo(
  bookId: string,
  form: { title?: string; categoryId?: string; description?: string },
) {
  return apiRequest<Book>(`/api/books/${bookId}`, {
    method: "PATCH",
    data: form,
  });
}
