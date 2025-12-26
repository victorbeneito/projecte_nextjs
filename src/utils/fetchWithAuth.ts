export async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}
