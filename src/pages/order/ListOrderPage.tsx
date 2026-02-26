import { Button } from '@mantine/core';
import { useNavigate } from 'react-router';
import AppDataGrid from '@/components/AppDataGrid/AppDataGrid';
import useDataGrid from '@/hooks/useDataGrid';
import useDataGridSource from '@/hooks/useDataGridSource';
import AppPage from '@/layouts/AppPage';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';
import type { Order } from '@/types/order';
import { orderGridColumn } from './grid-column/order-grid-column';

export default function ListOrderPage() {
  const navigate = useNavigate();
  const source = useDataGridSource<Order>({
    url: api.getOrders,
    initialSort: [{ colId: 'created_at', order: 'desc' }],
  });

  const settings = useDataGrid({
    source,
    columnDefs: orderGridColumn({
      onView: (id) => navigate(`/order/${id}`),
      onEdit: (order) => navigate(`/order/create?table_id=${order.table_id}&order_id=${order.id}`),
      onDelete: handleDelete,
    }),
    showHeader: true,
    showSearch: false,
    leftAction: <Button onClick={() => navigate('/order/create')}>Buat Pesanan</Button>,
  });

  async function handleDelete(id: number) {
    const confirmed = await modalUtils.confirm('Apakah Anda yakin ingin menghapus pesanan ini?');
    if (!confirmed) return;

    const loading = modalUtils.loading();
    try {
      await client().delete(api.getOrderDetail(id));
      loading.close();
      toastUtils.success({ message: 'Pesanan berhasil dihapus' });
      source.remove(id);
    } catch (error) {
      loading.close();
      parseError(error);
    }
  }

  return (
    <AppPage hasAccess title="List Pesanan | POS" breadcrumbs={[{ title: 'List Pesanan' }]}>
      <AppDataGrid {...settings} />
    </AppPage>
  );
}
