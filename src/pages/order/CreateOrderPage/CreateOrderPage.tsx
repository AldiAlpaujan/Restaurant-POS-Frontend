import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconCheck,
  IconMinus,
  IconNotes,
  IconPlus,
  IconSearch,
  IconShoppingCart,
  IconTrash,
} from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router';
import { FoodItemService } from '@/data/FoodItemService';
import { OrderService } from '@/data/OrderService';
import { TableService } from '@/data/TableService';
import AppPage from '@/layouts/AppPage';
import type { AppViewStateType } from '@/layouts/AppViewState';
import AppViewState from '@/layouts/AppViewState';
import { currency } from '@/lib/formatters';
import { parseError } from '@/lib/http-handlers';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';
import type { FoodItem } from '@/types/food-item';
import type { Table } from '@/types/table';

type CartItem = {
  foodItem: FoodItem;
  quantity: number;
  notes: string | null;
  // true = already stored in DB (came from existing order), false = newly added this session
  isExisting: boolean;
};

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableIdParam = searchParams.get('table_id');
  const orderIdParam = searchParams.get('order_id');

  // Table & status state
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableIsLocked, setTableIsLocked] = useState(false);
  const [tableStatus, setTableStatus] = useState<'occupied' | 'reserved'>('occupied');

  // Food state
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Existing order
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);

  // Loading
  const [viewState, setViewState] = useState<AppViewStateType>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  // Notes toggle
  const [openNotes, setOpenNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    initPage();
  }, []);

  async function initPage() {
    setViewState('loading');
    try {
      const [items, cats, tables] = await Promise.all([
        FoodItemService.getFoodItems(),
        FoodItemService.getCategories(),
        TableService.getAvailableTables(),
      ]);

      setFoodItems(items.filter((f) => f.is_available));
      setCategories(['Semua', ...cats]);
      setAvailableTables(tables);

      function loadOrderIntoCart(
        existingOrder: Awaited<ReturnType<typeof OrderService.getOrderDetail>>
      ) {
        setExistingOrderId(existingOrder.id);
        setTableStatus(existingOrder.status === 'reserved' ? 'reserved' : 'occupied');
        setCart(
          existingOrder.items.map((oi) => ({
            foodItem: {
              id: oi.food_item.id,
              name: oi.food_item.name,
              price: oi.food_item.price,
              category: oi.food_item.category,
              description: null,
              is_available: true,
              deleted_at: null,
              created_at: '',
              updated_at: '',
            },
            quantity: oi.quantity,
            notes: null,
            isExisting: true,
          }))
        );
      }

      // From dashboard: table pre-selected, try to load existing order
      if (tableIdParam) {
        const tableId = Number(tableIdParam);
        const [table, existingOrder] = await Promise.all([
          TableService.getTableById(tableId),
          OrderService.getOrderFromTable(tableId),
        ]);
        if (table) {
          setSelectedTable(table);
          setTableIsLocked(true);
          if (table.status === 'reserved') setTableStatus('reserved');
        }
        if (existingOrder) loadOrderIntoCart(existingOrder);
      }

      // From order list: load by order_id
      if (orderIdParam && !tableIdParam) {
        const existingOrder = await OrderService.getOrderDetail(Number(orderIdParam));
        loadOrderIntoCart(existingOrder);
        const table = await TableService.getTableById(existingOrder.table_id);
        if (table) {
          setSelectedTable(table);
          setTableIsLocked(true);
        }
      }
    } catch (error) {
      parseError(error);
    } finally {
      setViewState('content');
    }
  }

  // Block food only for brand-new reserved orders (existing reserved orders can add items)
  const isReserved = tableStatus === 'reserved';
  const blockFood = isReserved && !existingOrderId;

  function addToCart(foodItem: FoodItem) {
    if (blockFood) return;
    setCart((prev) => {
      const newEntry = prev.find((c) => c.foodItem.id === foodItem.id && !c.isExisting);
      if (newEntry) {
        return prev.map((c) =>
          c.foodItem.id === foodItem.id && !c.isExisting ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { foodItem, quantity: 1, notes: null, isExisting: false }];
    });
  }

  function updateQty(foodItemId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.foodItem.id === foodItemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function removeFromCart(foodItemId: number) {
    setCart((prev) => prev.filter((c) => c.foodItem.id !== foodItemId));
  }

  function toggleNotes(foodItemId: number) {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(foodItemId)) {
        next.delete(foodItemId);
        setCart((c) =>
          c.map((item) => (item.foodItem.id === foodItemId ? { ...item, notes: null } : item))
        );
      } else {
        next.add(foodItemId);
      }
      return next;
    });
  }

  function updateNotes(foodItemId: number, notes: string) {
    setCart((prev) =>
      prev.map((c) => (c.foodItem.id === foodItemId ? { ...c, notes: notes || null } : c))
    );
  }

  function handleStatusChange(val: string | null) {
    setTableStatus((val as 'occupied' | 'reserved') ?? 'occupied');
  }

  // Only newly added items (not from existing order) go to addOrderItems
  const newItems = cart.filter((c) => !c.isExisting);

  const totalPrice = cart.reduce((sum, c) => sum + Number(c.foodItem.price) * c.quantity, 0);

  const filteredFoodItems = foodItems.filter((f) => {
    const matchCategory = selectedCategory === 'Semua' || f.category === selectedCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  async function handleSubmit() {
    if (!selectedTable) {
      toastUtils.error({ message: 'Pilih meja terlebih dahulu' });
      return;
    }

    if (existingOrderId) {
      // Edit mode: only send newly added items
      if (newItems.length === 0) {
        toastUtils.error({ message: 'Tidak ada menu baru untuk ditambahkan' });
        return;
      }
      setSubmitting(true);
      try {
        await OrderService.addOrderItems(existingOrderId, {
          items: newItems.map((c) => ({
            food_item_id: c.foodItem.id,
            quantity: c.quantity,
            notes: c.notes ?? undefined,
          })),
        });
        toastUtils.success({ message: 'Item berhasil ditambahkan ke pesanan' });
        navigate('/order');
      } catch (error) {
        parseError(error);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Create mode — reserved allows empty items
      if (!blockFood && cart.length === 0) {
        toastUtils.error({ message: 'Tambahkan menu terlebih dahulu' });
        return;
      }
      setSubmitting(true);
      try {
        await OrderService.createOrder({
          table_id: selectedTable.id,
          table_status: tableStatus,
          items: cart.map((c) => ({
            food_item_id: c.foodItem.id,
            quantity: c.quantity,
            notes: c.notes ?? undefined,
          })),
        });
        toastUtils.success({ message: 'Pesanan berhasil dibuat' });
        navigate('/order');
      } catch (error) {
        parseError(error);
      } finally {
        setSubmitting(false);
      }
    }
  }

  async function handleCloseOrder() {
    if (!existingOrderId) return;

    const confirmed = await modalUtils.confirm('Apakah Anda yakin ingin menutup pesanan ini?');
    if (!confirmed) return;

    setClosing(true);
    try {
      await OrderService.closeOrder(existingOrderId);
      await OrderService.downloadReceipt(existingOrderId);
      toastUtils.success({ message: 'Pesanan berhasil ditutup' });
      navigate('/order');
    } catch (error) {
      parseError(error);
    } finally {
      setClosing(false);
    }
  }

  const submitLabel = existingOrderId ? 'Tambah Item' : 'Buat Pesanan';
  const submitDisabled = existingOrderId
    ? newItems.length === 0
    : !selectedTable || (!blockFood && cart.length === 0);

  return (
    <AppPage
      hasAccess
      title="Buat Pesanan | POS"
      breadcrumbs={[{ title: 'List Pesanan', link: '/order' }, { title: 'Buat Pesanan' }]}
    >
      <AppViewState viewState={viewState}>
        <div className="h-full bg-[#F7F9FA]">
          <div className="flex h-full gap-4 p-4">
            {/* Left Panel: Food Menu */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              {/* Search */}
              <div className="border-b border-gray-200 p-4">
                <TextInput
                  placeholder="Cari menu..."
                  leftSection={<IconSearch size={16} />}
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                />
              </div>

              {/* Category Tabs */}
              <div className="overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-2 px-4 py-3">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'filled' : 'light'}
                      size="xs"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Food Items Grid */}
              <ScrollArea className="flex-1" type="auto">
                {blockFood ? (
                  <div className="flex h-40 items-center justify-center text-gray-400">
                    <Text size="sm">Menu tidak dapat dipilih untuk pesanan Reserved baru</Text>
                  </div>
                ) : filteredFoodItems.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-gray-400">
                    <Text size="sm">Tidak ada menu ditemukan</Text>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredFoodItems.map((item) => {
                      const inCart = cart.find((c) => c.foodItem.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-400 hover:bg-blue-50"
                          onClick={() => addToCart(item)}
                        >
                          <Text fw={500} size="sm" lineClamp={2} mb={4}>
                            {item.name}
                          </Text>
                          <Text size="xs" c="dimmed" mb={8}>
                            {item.category}
                          </Text>
                          <div className="flex items-center justify-between">
                            <Text size="sm" fw={600} c="blue">
                              {currency(item.price)}
                            </Text>
                            {inCart && (
                              <Badge size="xs" variant="light">
                                {inCart.quantity}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right Panel: Order Summary */}
            <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <IconShoppingCart size={18} />
                  <Title order={5}>Pesanan Saat Ini</Title>
                </div>

                <div className="flex flex-col gap-2">
                  {tableIsLocked ? (
                    <TextInput
                      label="Meja"
                      value={selectedTable ? `Meja ${selectedTable.number}` : '-'}
                      readOnly
                      disabled
                    />
                  ) : (
                    <Select
                      label="Pilih Meja"
                      placeholder="Pilih meja tersedia..."
                      data={availableTables.map((t) => ({
                        value: String(t.id),
                        label: `Meja ${t.number}`,
                      }))}
                      value={selectedTable ? String(selectedTable.id) : null}
                      onChange={(val) => {
                        const table = availableTables.find((t) => String(t.id) === val) ?? null;
                        setSelectedTable(table);
                      }}
                      clearable
                    />
                  )}

                  <Select
                    label="Status Meja"
                    data={[
                      { value: 'occupied', label: 'Occupied' },
                      { value: 'reserved', label: 'Reserved' },
                    ]}
                    value={tableStatus}
                    onChange={handleStatusChange}
                    disabled={!!existingOrderId}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1" type="auto">
                {cart.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
                    <IconShoppingCart size={32} opacity={0.3} />
                    <Text size="sm">Belum ada pesanan</Text>
                  </div>
                ) : (
                  <div className="p-2">
                    {cart.map((item) => (
                      <div key={item.foodItem.id} className="px-1 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <Text size="sm" fw={500} lineClamp={1}>
                                {item.foodItem.name}
                              </Text>
                              {item.isExisting && (
                                <IconCheck size={12} className="shrink-0 text-green-500" />
                              )}
                            </div>
                            <Text size="xs" c="dimmed">
                              {currency(item.foodItem.price)}
                            </Text>
                          </div>
                          {!item.isExisting && (
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => removeFromCart(item.foodItem.id)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {!item.isExisting && (
                              <>
                                <ActionIcon
                                  variant="light"
                                  size="sm"
                                  onClick={() => updateQty(item.foodItem.id, -1)}
                                >
                                  <IconMinus size={12} />
                                </ActionIcon>
                                <span className="w-6 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>
                                <ActionIcon
                                  variant="light"
                                  size="sm"
                                  onClick={() => updateQty(item.foodItem.id, 1)}
                                >
                                  <IconPlus size={12} />
                                </ActionIcon>
                                <ActionIcon
                                  variant={openNotes.has(item.foodItem.id) ? 'light' : 'subtle'}
                                  color={openNotes.has(item.foodItem.id) ? 'blue' : 'gray'}
                                  size="sm"
                                  onClick={() => toggleNotes(item.foodItem.id)}
                                >
                                  <IconNotes size={12} />
                                </ActionIcon>
                              </>
                            )}
                            {item.isExisting && (
                              <span className="text-xs text-gray-400">x{item.quantity}</span>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {currency(Number(item.foodItem.price) * item.quantity)}
                          </span>
                        </div>

                        {openNotes.has(item.foodItem.id) && (
                          <TextInput
                            mt={6}
                            size="xs"
                            placeholder="Catatan..."
                            value={item.notes ?? ''}
                            onChange={(e) => updateNotes(item.foodItem.id, e.currentTarget.value)}
                            autoFocus
                          />
                        )}
                        <Divider mt={8} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Total & Actions */}
              <div className="border-t border-gray-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-bold text-blue-600">{currency(totalPrice)}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    fullWidth
                    loading={submitting}
                    disabled={submitDisabled}
                    onClick={handleSubmit}
                  >
                    {submitLabel}
                  </Button>
                  {existingOrderId && tableStatus === 'occupied' && (
                    <Button
                      fullWidth
                      variant="light"
                      color="red"
                      loading={closing}
                      onClick={handleCloseOrder}
                    >
                      Tutup Pesanan
                    </Button>
                  )}
                  <Button fullWidth variant="light" color="gray" onClick={() => navigate('/order')}>
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppViewState>
    </AppPage>
  );
}
