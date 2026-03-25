const base_url = "http://localhost:3000/lawyers";
import ILawyer from "@/interfaces/ILawyer";

export const getAllLawyers = async (): Promise<ILawyer[]> => {
  const res = await fetch(base_url);
  if (!res.ok) throw new Error("Error while fetching lawyers!!!!");
  return res.json();
};

export const getLawyerById = async (lawyerId: string): Promise<ILawyer> => {
  const res = await fetch(`${base_url}/${lawyerId}`);
  if (!res.ok) throw new Error("Error while fetching lawyer by id!!!!");
  return res.json();
};

export const updateLawyerInfo = async (
  lawyerId: string,
  body: object,
): Promise<ILawyer> => {
  const res = await fetch(`${base_url}/${lawyerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error while updating lawyer!!!!");
  return res.json();
};

export const updatePortalPassword = async (
  lawyerId: string,
  body: object,
): Promise<ILawyer> => {
  const res = await fetch(`${base_url}/${lawyerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error while updating lawyer!!!!");
  return res.json();
};
export const createLawyer = async (body: object): Promise<ILawyer> => {
  const res = await fetch(`${base_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error while creating lawyer!!!!");
  return res.json();
};

export const deleteLawyer = async (id: string): Promise<ILawyer> => {
  const res = await fetch(`${base_url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Error while deleting lawyer!!!!");
  return res.json();
};
