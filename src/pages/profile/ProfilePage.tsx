import { Text } from '@mantine/core';
import AppKeyValueForm from '@/components/Shared/AppKeyValueItem';
import AppPage from '@/layouts/AppPage';
import AppViewState from '@/layouts/AppViewState';
import { formatDate } from '@/lib/formatters';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';

export default function ProfilePage() {
  const { profile, profileLoading } = useAppLayoutContext();

  return (
    <AppPage hasAccess title="Profile | POS" breadcrumbs={[{ title: 'Profile' }]}>
      <AppViewState viewState={profileLoading ? 'loading' : 'content'}>
        {profile && (
          <div className="p-4">
            <Text fw={700} size="xl" className="mb-2">
              Profile
            </Text>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <AppKeyValueForm>
                <AppKeyValueForm.KeyValueItem label="Nama">{profile.name}</AppKeyValueForm.KeyValueItem>
                <AppKeyValueForm.KeyValueItem label="Email">{profile.email}</AppKeyValueForm.KeyValueItem>
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