import { Button } from '@mantine/core';
import AppDataGrid from '@/components/AppDataGrid/AppDataGrid';
import useDataGrid from '@/hooks/useDataGrid';
import useDataGridSource from '@/hooks/useDataGridSource';
import AppPage from '@/layouts/AppPage';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';
import type { FoodItem } from '@/types/food-item';
import FoodItemModal from './components/FoodItemModal';
import { foodItemGridColumn } from './grid-column/food-item-grid-column';

export default function Page() {
  const source = useDataGridSource<FoodItem>({
    url: api.getFoodItems,
    initialSort: [{ colId: 'created_at', order: 'desc' }],
  });

  const settings = useDataGrid({
    source,
    columnDefs: foodItemGridColumn({
      onDelete: handleDelete,
      onEdit: openFormModal,
    }),
    showHeader: true,
    leftAction: <Button onClick={() => openFormModal()}>Tambah</Button>,
  });

  function openFormModal(editData?: FoodItem) {
    modalUtils.customDialog({
      size: 'lg',
      builder: (modalId) => (
        <FoodItemModal
          modalId={modalId}
          editData={editData}
          onSuccess={(item) => {
            if (editData) {
              source.update(item);
            } else {
              source.insert(item);
            }
          }}
        />
      ),
    });
  }

  async function handleDelete(id: number) {
    const confirmed = await modalUtils.confirm('Apakah Anda yakin ingin menghapus makanan ini?');
    if (!confirmed) return;

    const loading = modalUtils.loading();
    try {
      await client().delete(api.deleteFoodItem(id));
      loading.close();
      toastUtils.success({ message: 'Makanan berhasil dihapus' });
      source.remove(id);
    } catch (error) {
      loading.close();
      parseError(error);
    }
  }

  return (
    <AppPage hasAccess title="Master Makanan | POS" breadcrumbs={[{ title: 'Master Makanan' }]}>
      <AppDataGrid {...settings} />
    </AppPage>
  );
}
