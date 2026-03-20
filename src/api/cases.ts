const base_url = "http://localhost:3000/cases";
import ICases from "@/interfaces/ICase";
export const getAllCases = async (lawyerId: string): Promise<ICases[]> => {
  const res = await fetch(`${base_url}?lawyer_id=${lawyerId}`);
  if (!res.ok) {
    throw new Error("Error while fetching cases");
  }

  return res.json();
};
