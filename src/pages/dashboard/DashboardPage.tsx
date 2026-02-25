import { useEffect, useState } from 'react';
import { Button, Group, Text, UnstyledButton } from '@mantine/core';
import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import AppPage from '@/layouts/AppPage';
import AppViewState, { type AppViewStateType } from '@/layouts/AppViewState';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';
import { TABLE_STATUS_CONFIG } from '@/lib/variable';
import type { Table, TablesResponse, TableStatus } from '@/types/table';
import TableActionModal from './components/Modal/TableActionModal';
import StatCard from './components/StatCard';
import TableCard from './components/TableCard';

export default function Page() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [viewState, setViewState] = useState<AppViewStateType>('loading');
  const [view, setView] = useState<'floor' | 'list'>('floor');

  async function fetchTables() {
    setViewState('loading');
    try {
      const res = await client().get<TablesResponse>(api.getTables);
      setTables(res.data.data);
      setViewState('content');
    } catch (error) {
      parseError(error);
      setViewState('error');
    }
  }

  useEffect(() => {
    async function load() {
      await fetchTables();
    }
    void load();
  }, []);

  async function handleSetInactive(table: Table) {
    const loading = modalUtils.loading();
    try {
      await client().patch(api.updateTableStatus(table.id), { status: 'inactive' });
      loading.close();
      toastUtils.success({ message: `Meja ${table.number} dinonaktifkan` });
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, status: 'inactive' as const } : t))
      );
    } catch (error) {
      loading.close();
      parseError(error);
    }
  }

  function handleTableClick(table: Table) {
    switch (table.status) {
      case 'inactive':
        modalUtils.info({
          title: 'Meja Tidak Aktif',
          message: `Meja ${table.number} sedang tidak aktif dan tidak dapat digunakan.`,
        });
        break;
      case 'occupied':
        navigate(`/order/${table.id}`);
        break;
      case 'reserved':
        navigate(`/order/create?table_id=${table.id}`);
        break;
      case 'available':
        modalUtils.customDialog({
          size: 'sm',
          builder: (modalId) => (
            <TableActionModal
              modalId={modalId}
              table={table}
              onCreateOrder={() => navigate(`/order/create?table_id=${table.id}`)}
              onSetInactive={() => handleSetInactive(table)}
            />
          ),
        });
        break;
    }
  }

  const counts = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    inactive: tables.filter((t) => t.status === 'inactive').length,
  };

  return (
    <AppPage hasAccess title="Dashboard | POS" breadcrumbs={[{ title: 'Dashboard' }]}>
      <div className="h-full p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Text fw={700} size="xl">
            Table Management
          </Text>
          <Group gap="xs">
            <Button
              size="sm"
              variant={view === 'floor' ? 'filled' : 'default'}
              leftSection={<IconLayoutGrid size={16} />}
              onClick={() => setView('floor')}
            >
              Floor Plan
            </Button>
            <Button
              size="sm"
              variant={view === 'list' ? 'filled' : 'default'}
              leftSection={<IconList size={16} />}
              onClick={() => setView('list')}
            >
              List View
            </Button>
          </Group>
        </div>

        <AppViewState viewState={viewState} callBackError={fetchTables}>
          {/* Status Legend */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
            <Text size="sm" fw={500} className="mb-2">
              Table Status
            </Text>
            <div className="flex flex-wrap gap-4">
              {(Object.keys(TABLE_STATUS_CONFIG) as TableStatus[]).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: TABLE_STATUS_CONFIG[status].dot }}
                  />
                  <Text size="sm">{TABLE_STATUS_CONFIG[status].label}</Text>
                </div>
              ))}
            </div>
          </div>

          {view === 'floor' ? (
            <div className="flex gap-4">
              {/* Table Grid */}
              <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-6 gap-3">
                  {tables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onClick={() => handleTableClick(table)}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="w-48 shrink-0">
                <Text fw={600} size="sm" className="mb-2">
                  Quick Stats
                </Text>
                <div className="flex flex-col gap-2">
                  <StatCard label="Available Tables" value={counts.available} />
                  <StatCard label="Occupied Tables" value={counts.occupied} />
                  <StatCard label="Reserved Tables" value={counts.reserved} />
                  <StatCard label="Inactive Tables" value={counts.inactive} />
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="rounded-lg border border-gray-200 bg-white">
              {tables.map((table, i) => (
                <UnstyledButton
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
                  style={{ borderTop: i > 0 ? '1px solid var(--mantine-color-gray-2)' : undefined }}
                >
                  <Text fw={500}>Table {table.number}</Text>
                  <span
                    className="rounded-full px-3 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: TABLE_STATUS_CONFIG[table.status].bg,
                      color: TABLE_STATUS_CONFIG[table.status].text,
                    }}
                  >
                    {TABLE_STATUS_CONFIG[table.status].label}
                  </span>
                </UnstyledButton>
              ))}
            </div>
          )}
        </AppViewState>
      </div>
    </AppPage>
  );
}
