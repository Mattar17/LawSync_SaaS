import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getOfficeById, updateOffice } from "@/api/office";

interface OfficeFormData {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export default function useOfficeSettings(id: string) {
  const [toast, setToast] = useState<string | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingOffice, setLoadingOffice] = useState(false);

  const [form, setForm] = useState<OfficeFormData>({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!id) return;

    async function getCurrentOffice() {
      setLoadingFetch(true);
      try {
        const data = await getOfficeById(id as string);

        if (!data.success) {
          showToast(data.message || "Failed to load office");
          return;
        }

        const office = data.data;
        setForm((prev) => ({
          ...prev,
          name: office.name ?? "",
          address: office.address ?? "",
          phone: office.phone ?? "",
          description: office.description ?? "",
        }));
      } catch {
        showToast("Something went wrong");
      } finally {
        setLoadingFetch(false);
      }
    }

    getCurrentOffice();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= OFFICE INFO UPDATE =================
  const handleOfficeUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingOffice(true);

    try {
      const res = await updateOffice(id as string, {
        name: form.name,
        address: form.address,
        phone: form.phone,
        description: form.description,
      });

      if (!res.success) {
        showToast(res.message || "Update failed");
        return;
      }

      showToast("Office updated");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingOffice(false);
    }
  };

  return {
    form,
    loadingFetch,
    loadingOffice,
    toast,

    handleChange,
    handleOfficeUpdate,
  };
}
