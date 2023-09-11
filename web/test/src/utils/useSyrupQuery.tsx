import { useQuery, UseQueryOptions, UseQueryResult, QueryFunction, QueryKey } from 'react-query';

export function useSyrupQuery<TQueryFnData = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData, QueryKey>,
  config?: Omit<
    UseQueryOptions<TQueryFnData, TError, TQueryFnData, QueryKey>,
    'initialData' | 'staleTime' | 'enabled'
  >
): UseQueryResult<TQueryFnData, TError> {
  const preloadedData = window?.__PRELOADED_DATA__;
  const shouldEnable = !preloadedData;
  const staleTime = preloadedData ? Infinity : 0;

  const finalConfig: UseQueryOptions<TQueryFnData, TError, TQueryFnData, QueryKey> = {
    initialData: preloadedData || [],
    staleTime,
    enabled: shouldEnable,
    ...config,
  };

  return useQuery(queryKey, queryFn, finalConfig);
}
