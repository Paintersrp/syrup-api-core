export const fetchUsers = async () => {
  const response = await fetch('http://localhost:4000/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const res = await response.json();
  return res.data.data;
};

export const fetchProfiles = async () => {
  const response = await fetch('http://localhost:4000/profile');

  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  const res = await response.json();
  return res.data.data;
};

type DataFetcherMap = {
  [key: string]: Promise<any>;
};

export const routeDataFetchers: DataFetcherMap = {
  '/users': fetchUsers(),
  '/profiles': fetchProfiles(),
};
