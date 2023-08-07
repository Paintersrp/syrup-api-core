/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useQuery } from 'react-query';
import { fetchProfiles } from './fetchProfiles';

import { Table } from '../Table/Table';
import { Page } from '../Page/Page';

interface ProfileProps {}

export const Profiles: React.FC<ProfileProps> = () => {
  const { data, isLoading, isError } = useQuery('profiles', fetchProfiles, {
    initialData: window.__PRELOADED_DATA__ || [],
  });

  if (isLoading) {
    return (
      <Page seoData={SEOProfiles}>
        <div>Loading...</div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page seoData={SEOProfiles}>
        <div>Error loading data</div>
      </Page>
    );
  }

  return (
    <Page seoData={SEOProfiles}>
      <Table
        data={data}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'createdAt', label: 'Created At' },
          { key: 'updatedAt', label: 'Updated At' },
        ]}
      />
    </Page>
  );
};

export const SEOProfiles = {
  title: 'Profile Page',
  description: 'User profiles with detailed information.',
  keywords: 'profiles, users, details',
  url: 'https://yourwebsite.com/app/profiles',
  image: 'https://yourwebsite.com/path-to-your-image.jpg',
};
