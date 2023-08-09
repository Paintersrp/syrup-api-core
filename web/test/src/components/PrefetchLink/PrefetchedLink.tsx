import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { fetchUsersData } from '../../pages/Users/fetch';
import { fetchProfiles } from '../../pages/Profiles/fetch';

export const PrefetchLink = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const [shouldPrefetch, setShouldPrefetch] = useState(false);

  const { refetch } = useQuery(['prefetch', to], () => fetchDataForRoute(to), {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: false,
  });

  useEffect(() => {
    if (shouldPrefetch) {
      refetch();
      setShouldPrefetch(false);
    }
  }, [shouldPrefetch, refetch]);

  const handleMouseOver = () => {
    setShouldPrefetch(true);
  };

  return (
    <Link to={to} onMouseOver={handleMouseOver} {...props}>
      {children}
    </Link>
  );
};

async function fetchDataForRoute(route: string) {
  switch (route) {
    case '/app/users':
      return fetchUsersData();
    case '/app/profiles':
      return fetchProfiles();
    default:
      throw new Error('Unknown route');
  }
}
