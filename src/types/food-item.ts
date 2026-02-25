export type FoodItem = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  is_available: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FoodItemFormPayload = {
  name: string;
  description?: string;
  price: number;
  category: string;
  is_available: boolean;
};