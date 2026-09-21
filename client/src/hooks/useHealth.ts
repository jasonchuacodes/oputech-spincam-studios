import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../services/health/health.api'

export const useHealthQuery = () =>
  useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  })
