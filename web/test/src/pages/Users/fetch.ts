export const fetchUsersData = async () => {
  const response = await fetch('http://localhost:4000/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  console.log('ran', 'ran123');

  const res = await response.json();
  return res.data.data;
};
