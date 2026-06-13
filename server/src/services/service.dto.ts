export interface ServiceDto {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: "м²" | "шт";
  icon: string;
  category: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CalculatorItemDto {
  id: string;
  title: string;
  price: number;
  unit: "м²" | "шт";
  category: string;
  isActive: boolean;
  sortOrder: number;
}
