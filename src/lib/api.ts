const API_URL = '/api'; // Next.js usa rutas relativas

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
}

export async function getClientes(token?: string) {
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/clientes`, { headers });
  return res.json();
}

export async function getPedidos(token?: string) {
  const headers: HeadersInit = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/pedidos`, { headers });
  return res.json();
}
