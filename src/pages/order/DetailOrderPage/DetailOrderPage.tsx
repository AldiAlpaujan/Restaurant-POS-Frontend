import { useEffect, useState } from 'react';
import { Badge, Button, Text } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router';
import AppKeyValueForm from '@/components/Shared/AppKeyValueItem';
import { OrderService, type OrderDetail } from '@/data/OrderService';
import AppPage from '@/layouts/AppPage';
import AppViewState, { type AppViewStateType } from '@/layouts/AppViewState';
import { currency, formatDate } from '@/lib/formatters';
import { parseError } from '@/lib/http-handlers';
import { ORDER_STATUS_CONFIG } from '@/lib/variable';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [viewState, setViewState] = useState<AppViewStateType>('loading');
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await OrderService.getOrderDetail(Number(id));
        setOrder(data);
        setViewState('content');
      } catch (error) {
        parseError(error);
        setViewState('error');
      }
    }
    void load();
  }, [id]);

  async function handlePrintReceipt() {
    if (!order) return;
    setPrinting(true);
    try {
      await OrderService.downloadReceipt(order.id);
    } catch (error) {
      parseError(error);
    } finally {
      setPrinting(false);
    }
  }

  return (
    <AppPage
      hasAccess
      title="Detail Pesanan | POS"
      breadcrumbs={[{ title: 'List Pesanan', link: '/order' }, { title: 'Detail Pesanan' }]}
    >
      <AppViewState viewState={viewState} callBackError={() => window.location.reload()}>
        {order && (
          <div className="p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <Text fw={700} size="xl">
                Pesanan #{order.id}
              </Text>
              <div className="flex gap-2">
                {order.status === 'closed' && (
                  <Button
                    leftSection={<IconPrinter size={16} />}
                    variant="light"
                    loading={printing}
                    onClick={handlePrintReceipt}
                  >
                    Print Receipt
                  </Button>
                )}
                <Button variant="light" color="gray" onClick={() => navigate('/order')}>
                  Kembali
                </Button>
              </div>
            </div>

            {/* Order Info */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
              <Text fw={600} size="sm" className="mb-3">
                Informasi Pesanan
              </Text>
              <AppKeyValueForm>
                <AppKeyValueForm.KeyValueItem label="No. Meja">
                  {order.table?.number ?? '-'}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Status">
                  <Badge color={ORDER_STATUS_CONFIG[order.status].color} variant="light">
                    {ORDER_STATUS_CONFIG[order.status].label}
                  </Badge>
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Total">
                  {currency(order.total_price)}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Dibuka">
                  {formatDate(order.opened_at, 'DD/MM/YYYY HH:mm') ?? '-'}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Ditutup">
                  {order.closed_at ? formatDate(order.closed_at, 'DD/MM/YYYY HH:mm') : '-'}
                </AppKeyValueForm.KeyValueItem>
              </AppKeyValueForm>
            </div>

            {/* Order Items Table */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <Text fw={600} size="sm">
                  Item Pesanan
                </Text>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">#</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Menu</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Kategori</th>
                    <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Harga</th>
                    <th className="px-4 py-2.5 text-center font-semibold text-gray-600">Qty</th>
                    <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                        Tidak ada item
                      </td>
                    </tr>
                  ) : (
                    order.items.map((item, i) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-2.5 font-medium">{item.food_item.name}</td>
                        <td className="px-4 py-2.5 text-gray-500">{item.food_item.category}</td>
                        <td className="px-4 py-2.5 text-right">{currency(item.price)}</td>
                        <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {currency(Number(item.price) * item.quantity)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td colSpan={5} className="px-4 py-2.5 text-right font-semibold">
                      Total
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-blue-600">
                      {currency(order.total_price)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </AppViewState>
    </AppPage>
  );
}
