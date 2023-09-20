export const genericFetch = (endpoint: string) => {
  return async () => {
    const response = await fetch(`http://localhost:4000/${endpoint}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    const res = await response.json();
    return res.data.data;
  };
};
