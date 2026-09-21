import { useQuery } from '@tanstack/react-query'

import { getMe } from '../services/auth/auth.api'

export function useMe() {
  const token = localStorage.getItem('auth')
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
