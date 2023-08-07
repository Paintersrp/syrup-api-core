/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchProfiles = async () => {
  const response = await fetch('http://localhost:4000/profile');

  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  const res = await response.json();
  return res.data.data;
};
