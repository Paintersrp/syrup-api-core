import React from 'react';
import { useSyrupQuery } from '../../utils/useSyrupQuery';

import { Table } from '../../components/Table/Table';
import { Page } from '../../components/Page/Page';
import userPageConfig from './config';
import { genericFetch } from '../../utils/genericFetch';

interface UsersProps {}

const Users: React.FC<UsersProps> = () => {
  const { data, isLoading, isError } = useSyrupQuery('users', genericFetch('users'));

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
      test test2 test3
      <Table data={data} columns={tableColumns} />
    </Page>
  );
};

export default Users;
