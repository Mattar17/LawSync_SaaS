// hooks/useIsOfficeOwner.ts
import { useUserStore } from "@/zustandStore/userStore";

export function useIsOfficeOwner() {
  const user = useUserStore((s) => s.user);
  const currentOffice = useUserStore((s) => s.currentOffice);
  console.log("user:", user);
  console.log("currentOffice:", currentOffice);
  return !!user && !!currentOffice && currentOffice.owner_id === user.id;
}
