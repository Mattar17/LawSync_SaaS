// hooks/useLawyerOffices.ts
import { useEffect, useState, useCallback } from "react";
import { getMyOffices, leaveOffice, type MyOffice } from "@/api/office";
import { toast } from "sonner";

export function useLawyerOffices() {
  const [offices, setOffices] = useState<MyOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState<string | null>(null);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    const res = await getMyOffices();

    if (res.success) {
      setOffices(res.data);
    } else {
      toast.error("حدث خطأ أثناء تحميل معلومات المكتب");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const quitOffice = useCallback(async (officeId: string) => {
    setLoadingFetch(officeId);
    const res = await leaveOffice(officeId);
    console.log(res);
    if (res.success) {
      setOffices((prev) => prev.filter((o) => o.offices.id !== officeId));
      toast.success(res.message ?? "تمت مغادرة المكتب بنجاح.");
    } else {
      toast.error(res.message ?? "فشل مغادرة المكتب.");
    }

    setLoadingFetch(null);
  }, []);

  return { offices, loading, loadingFetch, quitOffice, refetch: fetchOffices };
}
