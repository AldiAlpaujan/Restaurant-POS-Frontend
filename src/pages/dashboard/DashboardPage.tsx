import { useEffect, useState } from 'react';
import { Badge, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router';
import AppPage from '@/layouts/AppPage';
import AppViewState, { type AppViewStateType } from '@/layouts/AppViewState';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import type { Table, TablesResponse } from '@/types/table';

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'green' },
  occupied: { label: 'Occupied', color: 'red' },
} as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [viewState, setViewState] = useState<AppViewStateType>('loading');

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

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;

  function handleTableClick(table: Table) {
    if (table.status === 'occupied') {
      navigate(`/order/${table.id}`);
    } else {
      navigate(`/order/create?table_id=${table.id}`);
    }
  }

  return (
    <AppPage hasAccess title="Dashboard | POS" breadcrumbs={[{ title: 'Dashboard' }]}>
      <div className="p-4 lg:p-6">
        <AppViewState viewState={viewState} callBackError={fetchTables}>
          {/* Quick Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total Meja" value={tables.length} color="blue" />
            <StatCard label="Available" value={availableCount} color="green" />
            <StatCard label="Occupied" value={occupiedCount} color="red" />
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
              <div key={status} className="flex items-center gap-1.5">
                <Badge color={cfg.color} variant="filled" size="sm" />
                <Text size="sm" c="dimmed">
                  {cfg.label}
                </Text>
              </div>
            ))}
          </div>

          {/* Table Grid */}
          <SimpleGrid cols={{ base: 4, sm: 6, lg: 8 }} spacing="sm">
            {tables.map((table) => (
              <TableCard key={table.id} table={table} onClick={() => handleTableClick(table)} />
            ))}
          </SimpleGrid>
        </AppViewState>
      </div>
    </AppPage>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Text size="xl" fw={700} c={color}>
        {value}
      </Text>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
    </div>
  );
}

function TableCard({ table, onClick }: { table: Table; onClick: () => void }) {
  const cfg = STATUS_CONFIG[table.status];

  return (
    <UnstyledButton
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md"
      style={{
        borderColor:
          table.status === 'available'
            ? 'var(--mantine-color-green-4)'
            : 'var(--mantine-color-red-4)',
        backgroundColor:
          table.status === 'available'
            ? 'var(--mantine-color-green-0)'
            : 'var(--mantine-color-red-0)',
      }}
    >
      <Text fw={700} size="lg">
        {table.number}
      </Text>
      <Text size="xs" c={cfg.color}>
        {cfg.label}
      </Text>
    </UnstyledButton>
  );
}
