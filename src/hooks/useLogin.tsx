import authToken from '@/lib/auth-token';

export default function useLogin(): boolean {
  const token = authToken.getToken();

  return Boolean(token);
}
