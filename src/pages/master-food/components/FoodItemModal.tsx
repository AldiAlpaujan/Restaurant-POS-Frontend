import { NumberInput, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import AppFormModal from '@/components/Shared/AppFormModal';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { modalManager } from '@/lib/modal-manager';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';
import type { FoodItem } from '@/types/food-item';
import { foodItemValidator, type FoodItemValidatorType } from '../validator/food-item-validator';

const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Food' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Snack' },
];

interface FoodItemModalProps {
  modalId: string;
  editData?: FoodItem;
  onSuccess: (item: FoodItem) => void;
}

export default function FoodItemModal({ modalId, editData, onSuccess }: FoodItemModalProps) {
  const isEdit = !!editData;

  const form = useForm<FoodItemValidatorType>({
    mode: 'uncontrolled',
    initialValues: {
      name: editData?.name ?? '',
      category: editData?.category ?? '',
      price: editData ? Number(editData.price) : (undefined as any),
      description: editData?.description ?? '',
      is_available: editData?.is_available ?? true,
    },
    validate: valibotResolver(foodItemValidator),
  });

  async function onSubmit(values: FoodItemValidatorType) {
    const loading = modalUtils.loading();
    try {
      let res;
      if (isEdit) {
        res = await client().put<{ data: FoodItem }>(api.updateFoodItem(editData!.id), values);
      } else {
        res = await client().post<{ data: FoodItem }>(api.createFoodItem, values);
      }
      loading.close();
      toastUtils.success({ message: `Makanan berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}` });
      onSuccess(res.data.data);
      modalManager.close(modalId);
    } catch (error) {
      loading.close();
      parseError(error);
    }
  }

  return (
    <AppFormModal
      modalId={modalId}
      title={isEdit ? 'Edit Makanan' : 'Tambah Makanan'}
      submitLabel={isEdit ? 'Simpan' : 'Tambah'}
      onSubmit={form.onSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-3">
        <TextInput
          key={form.key('name')}
          {...form.getInputProps('name')}
          label="Nama"
          placeholder="Masukkan nama makanan"
          withAsterisk
        />
        <Select
          key={form.key('category')}
          {...form.getInputProps('category')}
          label="Kategori"
          placeholder="Pilih kategori"
          data={CATEGORY_OPTIONS}
          withAsterisk
        />
        <NumberInput
          key={form.key('price')}
          {...form.getInputProps('price')}
          label="Harga"
          placeholder="Masukkan harga"
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
          min={0}
          withAsterisk
        />
        <Textarea
          key={form.key('description')}
          {...form.getInputProps('description')}
          label="Deskripsi"
          placeholder="Masukkan deskripsi (opsional)"
          autosize
          minRows={2}
        />
        <Switch
          key={form.key('is_available')}
          {...form.getInputProps('is_available', { type: 'checkbox' })}
          label="Tersedia"
        />
      </div>
    </AppFormModal>
  );
}
