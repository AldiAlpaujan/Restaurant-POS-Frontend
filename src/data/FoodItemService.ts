import client, { api } from '@/lib/http-client';
import type { FoodItem } from '@/types/food-item';

export type FoodCategory = { category: string };

export class FoodItemService {
  static async getFoodItems(): Promise<FoodItem[]> {
    const res = await client().get<{ data: FoodItem[] }>(api.getFoodItems);
    return res.data?.data ?? (res.data as unknown as FoodItem[]);
  }

  static async getCategories(): Promise<string[]> {
    const res = await client().get<{ data: string[] }>(api.getFoodCategories);
    return res.data?.data ?? (res.data as unknown as string[]);
  }
}
