import React from 'react';
import { useQuery } from 'react-query';

import { Table } from '../../components/Table/Table';
import { Page } from '../../components/Page/Page';
import profilePageConfig from './config';
import Notifications from '../../components/Notifications';
import { genericFetch } from '../../utils/genericFetch';

interface ProfileProps {}

export const Profiles: React.FC<ProfileProps> = () => {
  const { data, isLoading, isError } = useQuery('profiles', genericFetch('profile'));

  if (isLoading) {
    return <Page>Loading...</Page>;
  }

  if (isError) {
    return <Page>Error loading data</Page>;
  }

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
  ];

  return (
    <Page seoData={profilePageConfig.seo}>
      <Notifications />
      sdadssdadsssssssssss
      <Table data={data} columns={tableColumns} />
    </Page>
  );
};

export default Profiles;
