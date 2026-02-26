import { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import AppKeyValueForm from '@/components/Shared/AppKeyValueItem';
import AppPage from '@/layouts/AppPage';
import AppViewState, { type AppViewStateType } from '@/layouts/AppViewState';
import { formatDate } from '@/lib/formatters';
import client, { api } from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';

type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [viewState, setViewState] = useState<AppViewStateType>('loading');

  useEffect(() => {
    async function load() {
      try {
        const res = await client().get<{ data: Profile }>(api.profile);
        setProfile(res.data?.data ?? (res.data as unknown as Profile));
        setViewState('content');
      } catch (error) {
        parseError(error);
        setViewState('error');
      }
    }
    void load();
  }, []);

  return (
    <AppPage hasAccess title="Profile | POS" breadcrumbs={[{ title: 'Profile' }]}>
      <AppViewState viewState={viewState} callBackError={() => window.location.reload()}>
        {profile && (
          <div className="p-4">
            <Text fw={700} size="xl" className="mb-2">
              Profile
            </Text>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <AppKeyValueForm>
                <AppKeyValueForm.KeyValueItem label="Nama">
                  {profile.name}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Email">
                  {profile.email}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Role">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Bergabung">
                  {formatDate(profile.created_at, 'DD/MM/YYYY HH:mm') ?? '-'}
                </AppKeyValueForm.KeyValueItem>
              </AppKeyValueForm>
            </div>
          </div>
        )}
      </AppViewState>
    </AppPage>
  );
}
