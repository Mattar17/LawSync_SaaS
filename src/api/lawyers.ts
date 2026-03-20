const base_url = "http://localhost:3000/lawyers";
import ILawyer from "@/interfaces/ILawyer";

export const getAllLawyers = async (): Promise<ILawyer[]> => {
  const res = await fetch(base_url);
  if (!res.ok) throw new Error("Error while fetching lawyers!!!!");
  return res.json();
};
