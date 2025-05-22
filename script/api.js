// Handles fetching dessert data from a JSON source

export async function fetchDesserts() {
  const response = await fetch("data.json");

  if (!response.ok) throw new Error("Failed to fetch desserts");

  const data = await response.json();
  return data.map((dessert = { ...dessert, qty: 0 }));
}
