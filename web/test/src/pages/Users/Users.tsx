import React from 'react';
import { useQuery } from 'react-query';
import { fetchUsersData } from './fetch';

import { Table } from '../../components/Table/Table';
import { Page } from '../../components/Page/Page';
import userPageConfig from './config';

interface UsersProps {}

export const Users: React.FC<UsersProps> = () => {
  const { data, isLoading, isError } = useQuery('users', fetchUsersData, {
    initialData: window.__PRELOADED_DATA__ || [],
  });

  if (isLoading) {
    return <Page>Loading...</Page>;
  }

  if (isError) {
    return <Page>Error loading data</Page>;
  }

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'User Role' },
  ];

  return (
    <Page seoData={userPageConfig.seo}>
      <Table data={data} columns={tableColumns} />
    </Page>
  );
};
