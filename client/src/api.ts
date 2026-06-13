import type { CalculatorItem, Employee, EstimateItem, Profile, Review, ServiceItem, SessionUser } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Ошибка запроса" }));
    throw new Error(Array.isArray(payload.message) ? payload.message.join(", ") : payload.message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  me: () => request<{ user: SessionUser | null }>("/auth/me"),
  register: (payload: { email: string; password: string; username: string }) =>
    request<{ user: SessionUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ user: SessionUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
  profile: () => request<Profile>("/profile"),
  updateProfile: (payload: Partial<Profile>) =>
    request<Profile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  services: () => request<ServiceItem[]>("/services"),
  calculatorItems: () => request<CalculatorItem[]>("/calculator/items"),
  employees: () => request<Employee[]>("/employees"),
  reviews: () => request<Review[]>("/reviews"),
  createOrder: (payload: { customerName: string; phone: string; serviceId: string; area?: number; message?: string }) =>
    request<{ id: string; mail: { status: "sent" | "skipped" | "failed"; message: string } }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  estimate: (items: EstimateItem[]) =>
    request<{ total: number }>("/calculator/estimate", {
      method: "POST",
      body: JSON.stringify({ items })
    }),
  createReview: (payload: { reviewText: string; rating: number; images: File[] }) => {
    const formData = new FormData();
    formData.set("reviewText", payload.reviewText);
    formData.set("rating", String(payload.rating));
    payload.images.forEach((image) => formData.append("images", image));

    return request<Review>("/reviews", {
      method: "POST",
      body: formData
    });
  },
  adminCalculatorItems: () => request<CalculatorItem[]>("/admin/calculator-items"),
  updateAdminCalculatorItem: (id: string, payload: Partial<CalculatorItem>) =>
    request<CalculatorItem>(`/admin/calculator-items/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
};
