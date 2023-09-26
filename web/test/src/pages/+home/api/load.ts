export const load = async () => {
  const response = await fetch(`http://localhost:4000/users`);

  if (!response.ok) {
    throw new Error(`Failed to fetch /users`);
  }

  const res = await response.json();

  return res.data.data;
};

export default load;
