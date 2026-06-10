export interface ServiceDto {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: "м²" | "шт";
  icon: string;
  category: string;
}
