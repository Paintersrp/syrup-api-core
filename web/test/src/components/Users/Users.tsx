import React from 'react';
import { useQuery } from 'react-query';
import { fetchUsersData } from '../../pages/fetch';

import { Table } from '../Table/Table';
import { Page } from '../Page/Page';

interface UsersProps {}

export const Users: React.FC<UsersProps> = () => {
  const { data, isLoading, isError } = useQuery('users', fetchUsersData, {
    initialData: window.__PRELOADED_DATA__ || [],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <Page seoData={SEOUsers}>
      <Table
        data={data}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'username', label: 'Username' },
          { key: 'role', label: 'User Role' },
        ]}
      />
    </Page>
  );
};

export const SEOUsers = {
  title: 'Users Page',
  description: 'User with detailed information.',
  keywords: 'users, details',
  url: 'https://yourwebsite.com/app/users',
  image: 'https://yourwebsite.com/path-to-your-image.jpg',
};
