export async function importModule(path: string) {
  try {
    return await import(/* @vite-ignore */ `${path}`);
  } catch (error) {
    console.error('Failed to import module:', error);
    throw error;
  }
}
