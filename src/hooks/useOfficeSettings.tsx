import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getOfficeById, updateOffice } from "@/api/office";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}

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
  const [officeName, setOfficeName] = useState("");

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
        const data = await getOfficeById(id);
        console.log(data);
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

  async function handleCreateOffice(e: any) {
    e.preventDefault();
    console.log("creating office .....");
    const jwtToken = Cookies.get("jwt");
    const decoded = jwtDecode(jwtToken!) as MyJwtPayload;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/offices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ name: officeName, owner_id: decoded.lawyer_id }),
    });

    const data = await res.json();
    return data.data;
  }

  return {
    form,
    loadingFetch,
    loadingOffice,
    toast,

    handleChange,
    handleOfficeUpdate,
    handleCreateOffice,
    officeName,
    setOfficeName,
  };
}
