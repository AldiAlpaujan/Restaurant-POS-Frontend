import * as v from 'valibot';

export const foodItemValidator = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Nama wajib diisi')),
  category: v.pipe(v.string(), v.minLength(1, 'Kategori wajib diisi')),
  price: v.pipe(v.number('Harga wajib diisi'), v.minValue(0, 'Harga tidak boleh negatif')),
  description: v.optional(v.string()),
  is_available: v.boolean(),
});

export type FoodItemValidatorType = v.InferOutput<typeof foodItemValidator>;