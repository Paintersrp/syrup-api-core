import React from 'react';
import { useQuery } from 'react-query';
import { fetchProfiles } from './fetch';

import { Table } from '../../components/Table/Table';
import { Page } from '../../components/Page/Page';
import profilePageConfig from './config';

interface ProfileProps {}

export const Profiles: React.FC<ProfileProps> = () => {
  const { data, isLoading, isError } = useQuery('profiles', fetchProfiles, {
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
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
  ];

  return (
    <Page seoData={profilePageConfig.seo}>
      <Table data={data} columns={tableColumns} />
    </Page>
  );
};
