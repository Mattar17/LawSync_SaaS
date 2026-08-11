import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: data.data as BookCategory | undefined,
    message: data.message,
  };
}

// GET /api/books/category
export async function getAllCategories() {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: (data.data as BookCategory[]) ?? [],
    message: data.message,
  };
}

// DELETE /api/books/category/:categoryId
export async function deleteCategory(categoryId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/category/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}

// POST /api/books/upload (multipart/form-data)
export async function uploadBook(
  categoryId: string,
  form: { title: string; description?: string; file: File },
) {
  const jwt = Cookies.get("jwt");

  const formData = new FormData();
  formData.append("categoryId", categoryId);
  formData.append("title", form.title);
  if (form.description) formData.append("description", form.description);
  formData.append("file", form.file);

  const res = await fetch(`${BASE_URL}/api/books/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
    body: formData,
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: data.data as Book | undefined,
    message: data.message,
  };
}

// GET /api/books/category/:categoryId
export async function getAllBooksInCategory(categoryId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/category/${categoryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: (data.data as Book[]) ?? [],
    message: data.message,
  };
}

// GET /api/books/:bookId
export async function getFileUrl(bookId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/${bookId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();
  return {
    success: res.ok,
    data: data.data as { url: string } | undefined,
    message: data.message,
  };
}

// DELETE /api/books/:bookId
export async function deleteBook(bookId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/${bookId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}

// PATCH /api/books/:bookId
export async function updateBookInfo(
  bookId: string,
  form: { title?: string; categoryId?: string; description?: string },
) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/books/${bookId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: data.data as Book | undefined,
    message: data.message,
  };
}
