const base_url = `${import.meta.env.VITE_BASE_URL}/api/cases`;

export const getAllCases = async (id: string) => {
  const res = await fetch(`${base_url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error("Error while fetching cases");
  }

  return res.json();
};
