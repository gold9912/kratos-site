export type Unit = "м²" | "шт";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: Unit;
  icon: string;
  category: string;
}

export interface CalculatorItem {
  id: string;
  title: string;
  price: number;
  unit: Unit;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  experience: string;
  photoUrl: string;
}

export interface Review {
  id: string;
  clientName: string;
  reviewText: string;
  rating: number;
  avatarUrl: string | null;
  images: string[];
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export interface Profile {
  username: string | null;
  birthDate: string | null;
  age: number | null;
  gender: string | null;
  avatarUrl: string | null;
}

export interface EstimateItem {
  serviceId: string;
  quantity: number;
}
