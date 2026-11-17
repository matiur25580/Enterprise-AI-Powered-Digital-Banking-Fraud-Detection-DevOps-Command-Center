export const API = (import.meta as any).env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("trustshield_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshSession(): Promise<boolean> {
  const csrf = sessionStorage.getItem("trustshield_csrf") || "";
  if (!csrf) return false;
  try {
    const response = await fetch(API + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": csrf }
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (!data.token || !data.csrfToken) return false;
    localStorage.setItem("trustshield_token", data.token);
    sessionStorage.setItem("trustshield_csrf", data.csrfToken);
    if (data.user) localStorage.setItem("trustshield_user", JSON.stringify(data.user));
    return true;
  } catch (_) {
    return false;
  }
}

async function request(path: string, init: RequestInit, retry = true): Promise<Response> {
  const buildHeaders = () => {
    const headers = new Headers(init.headers || {});
    Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value));
    return headers;
  };
  let response = await fetch(API + path, { ...init, headers: buildHeaders(), credentials: "include" });
  if (response.status === 401 && retry && await refreshSession()) {
    response = await fetch(API + path, { ...init, headers: buildHeaders(), credentials: "include" });
  }
  return response;
}

export async function apiGet(path: string) {
  const response = await request(path, { headers: authHeaders() });
  return response.json();
}

export async function apiPost(path: string, body: any) {
  const response = await request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body)
  });
  return response.json();
}
